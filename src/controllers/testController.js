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
    // Get test details
    const test = await Test.findById(id);
    
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Get questions for the test
    const { data: questions } = await supabase
      .from('questions')      .select('id, content')
      .eq('test_id', id);

    // Get choices for each question without is_correct field
    const questionsWithChoices = await Promise.all(questions.map(async (question) => {
      const { data: choices } = await supabase
        .from('choices')        .select('id, content')
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
