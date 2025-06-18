import { supabase } from '../index.js';
import { Test } from '../models/test.js';
import { Question } from '../models/question.js';
import { Choice } from '../models/choice.js';

export async function createFullTestController(req, res) {
  const { title, description, questions } = req.body;

  // Validate title
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  // Validate questions array
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'At least one question is required' });
  }

  // Validate each question
  for (const question of questions) {
    if (!question.content || question.content.trim() === '') {
      return res.status(400).json({ error: 'Question content is required' });
    }
    if (!Array.isArray(question.choices) || question.choices.length === 0) {
      return res.status(400).json({ error: 'Each question must have at least one choice' });
    }
    for (const choice of question.choices) {
      if (!choice.content || choice.content.trim() === '') {
        return res.status(400).json({ error: 'Choice content is required' });
      }
      if (typeof choice.is_correct !== 'boolean') {
        return res.status(400).json({ error: 'Choice must have a valid is_correct boolean value' });
      }
    }
  }

  try {
    // Create the test
    const newTest = await Test.create({ title, description });
    const testId = newTest.id;

    const createdQuestions = [];

    // Create questions and choices
    for (const q of questions) {      const newQuestion = await Question.create({
        test_id: testId,
        content: q.content
      });

      const questionId = newQuestion.id;

      // Create choices for the question
      for (let i = 0; i < q.choices.length; i++) {
        const choice = q.choices[i];
        await Choice.create({          question_id: questionId,
          content: choice.content,
          is_correct: choice.is_correct
        });
      }

      createdQuestions.push(newQuestion);
    }

    return res.status(201).json({
      message: 'Test created successfully',
      data: { test: newTest, questions: createdQuestions }
    });
  } catch (error) {
    console.error('Error creating test:', error.message);
    return res.status(500).json({ error: 'Internal server error', detail: error.message });
  }
}

export async function getTestController(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Test ID is required' });
  }

  try {
    const test = await Test.findById(id);
    
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Get questions for the test
    const { data: questions } = await supabase
      .from('questions')
      .select('id, content')
      .eq('test_id', id);

    // Get choices for each question including is_correct field
    const questionsWithChoices = await Promise.all(questions.map(async (question) => {
      const { data: choices } = await supabase
        .from('choices')
        .select('id, content')
        .eq('question_id', question.id);

      return {
        ...question,
        choices: choices
      };
    }));

    return res.status(200).json({
      data: {
        test,
        questions: questionsWithChoices
      }
    });

  } catch (error) {
    console.error('Error fetching test:', error.message);
    return res.status(500).json({ error: 'Internal server error', detail: error.message });
  }
}

export async function submitTestController(req, res) {
  try {
    const { test_id, answers } = req.body;
    const user = req.user;

    // Validate user authentication
    if (!user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Validate required fields
    if (!test_id || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'test_id and answers are required' });
    }

    // Validate test exists
    const test = await Test.findById(test_id);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    let score = 0;
    const detailed = [];

    // Process each answer
    for (const { question_id, answer_id } of answers) {
      if (!question_id || !answer_id) {
        return res.status(400).json({ 
          error: 'Each answer must contain question_id and answer_id'
        });
      }

      try {
        const { data: correct, error } = await supabase
          .from('choices')
          .select('id')
          .eq('question_id', question_id)
          .eq('is_correct', true)
          .single();

        if (error) {
          console.error('Database error:', error);
          return res.status(500).json({ 
            error: 'Error checking answer correctness'
          });
        }

        const is_correct = correct.id === answer_id;
        if (is_correct) score++;
        detailed.push({ question_id, answer_id, is_correct });
      } catch (err) {
        console.error('Answer processing error:', err);
        return res.status(500).json({ 
          error: 'Error processing answer'
        });
      }
    }

    const total = answers.length;
    const percentage = (score / total) * 100;

    try {
      const { data: questions } = await supabase
        .from('questions')
        .select('id, content')
        .eq('test_id', test_id);

      const fullQuestions = await Promise.all(questions.map(async (q) => {
        const { data: choices, error } = await supabase
          .from('choices')
          .select('id, content, is_correct')
          .eq('question_id', q.id);

        if (error) {
          throw new Error('Error fetching choices');
        }

        const userAnswer = detailed.find(a => a.question_id === q.id);
        
        // Add is_answered only to the user's selected choice
        const processedChoices = choices.map(choice => {
          if (choice.id === userAnswer?.answer_id) {
            return { ...choice, is_answered: true };
          }
          return choice;
        });

        return {
          ...q,
          choices: processedChoices
        };
      }));

      // Save test result
      const { error: resultError } = await supabase
        .from('test_results')
        .insert({
          user_id: user.id,
          test_id: test_id,
          score: score,
          total: total,
          percentage: percentage,
          submitted_at: new Date().toISOString()
        });

      if (resultError) {
        console.error('Error saving test result:', resultError);
      }

      return res.status(200).json({
        message: 'Test submitted successfully',
        result: {
          score,
          total,
          percentage,
          test,
          questions: fullQuestions
        }
      });

    } catch (err) {
      console.error('Error processing test results:', err);
      return res.status(500).json({ 
        error: 'Error processing test results'
      });
    }

  } catch (err) {
    console.error('Submit test error:', err);
    return res.status(500).json({ 
      error: 'Error submitting test'
    });
  }
}

export async function addQuestionsController(req, res) {
  const { test_id, questions } = req.body;

  if (!test_id || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'test_id and questions are required' });
  }

  try {
    const createdQuestions = [];

    for (const q of questions) {
      if (!q.content || !Array.isArray(q.choices) || q.choices.length === 0) continue;

      const newQuestion = await Question.create({
        test_id,
        content: q.content
      });

      const questionId = newQuestion.id;

      for (const choice of q.choices) {
        if (!choice.content || typeof choice.is_correct !== 'boolean') continue;

        await Choice.create({
          question_id: questionId,
          content: choice.content,
          is_correct: choice.is_correct
        });
      }

      createdQuestions.push(newQuestion);
    }

    return res.status(201).json({
      message: 'New questions added successfully',
      data: createdQuestions
    });
  } catch (error) {
    console.error('Error adding questions:', error.message);
    return res.status(500).json({ error: 'Internal server error', detail: error.message });
  }
}

export async function updateQuestionsController(req, res) {
  const { questions } = req.body;

  // Validate questions array
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'At least one question is required' });
  }

  try {
    const updatedQuestions = [];

    // Update each question and its choices
    for (const q of questions) {
      // Validate question data
      if (!q.id || !q.content || q.content.trim() === '') {
        return res.status(400).json({ error: 'Question ID and content are required for each question' });
      }

      if (!Array.isArray(q.choices)) {
        return res.status(400).json({ error: 'Choices must be an array for each question' });
      }

      // Verify the question exists
      const existingQuestion = await Question.findById(q.id);
      if (!existingQuestion) {
        return res.status(404).json({ error: `Question with ID ${q.id} not found` });
      }

      // Update the question
      const updatedQuestion = await Question.update(q.id, {
        content: q.content
      });

      // Update choices
      const updatedChoices = [];
      for (const choice of q.choices) {
        if (!choice.id) {
          return res.status(400).json({ error: 'Choice ID is required. Creating new choices is not allowed.' });
        }
        if (!choice.content || choice.content.trim() === '') {
          return res.status(400).json({ error: 'Choice content is required' });
        }
        if (typeof choice.is_correct !== 'boolean') {
          return res.status(400).json({ error: 'Choice must have a valid is_correct boolean value' });
        }

        // Update existing choice
        const updatedChoice = await Choice.update(choice.id, {
          content: choice.content,
          is_correct: choice.is_correct
        });
        updatedChoices.push(updatedChoice);
      }

      updatedQuestions.push({
        ...updatedQuestion,
        choices: updatedChoices
      });
    }

    return res.status(200).json({
      message: 'Questions updated successfully',
      data: updatedQuestions
    });
  } catch (error) {
    console.error('Error updating questions:', error.message);
    return res.status(500).json({ error: 'Internal server error', detail: error.message });
  }
}