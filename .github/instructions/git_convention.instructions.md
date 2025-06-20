---
applyTo: '**'
---

**GIT CONVENTIONS**

1. **Conventional commits**

**\*** Commit message nên có cấu trúc như sau:

**\<type\>[optional scope]: \<description\>**

**[optional body]**

**[optional footer]**

\* Commit **type** có cấu trúc như sau, để truyền đạt ý định cho người làm việc với dự án:

- **fix** : là commit có fix một lỗi trong source code (tương tự với PATCH trong sematic versioning)

- **feat** : là commit để giới thiêu, tạo ra một chức năng mới cho dự án (tương tự với MINOR trong sematic versioning)
 - **BREAKING CHANGE** : là commit type để chỉ ra rằng cấu trúc dự án đã bị phá vỡ (tương tự với MAJOR trong sematic versioning)

- **chore** : là commit type để chỉ những commit chỉ có những sự thay đổi nhỏ.

- **docs** : là commit type để viết tài liệu (document) cho dự án.

- **style** : là commit type để viết style cho dự án.

- **refactor** : là commit type để chỉ ra rằng source code của dự án đang được sửa lại clean hơn.

- **test** : là commit type để viết test (unit test, intergration test, …) cho dự án.

- **ci** : là commit type để viết configuration files hoặc scripts (ví dụ: Github action, Travis, Circle, BrowserStack, …)

- **build** : là commit type có thay đổi ảnh hưởng đến hệ thống build hoặc phụ thuộc bên ngoài (ví dụ: npm, yarn, glup, broccoli, …)

- **perf** : là commit type có thay đổi để cải thiện hiệu suất

Ví dụ:

feat: allow provided config object to extend other configs

chore!: drop Node 6 from testing matrix

docs: correct spelling of CHANGELOG

feat(lang): add polish language

fix: correct minor typos in code

\* Commit **scope** (không bắt buộc): là tên của package bị ảnh hưởng (ví dụng các package của npm, …)

\* Commit **description** : mô tả ngắn gọn về sự thay đội, nội dung của đoạn code trong commit

\* Commit **body** (không bắt buộc): giống như description, nhưng body nên bao gồm sự giải thích cho sự thay đổi và sự khác nhau với hành vi của đoạn code trước đó

\* Commit **footer** (không bắt buộc): chứa thông tin về việc BREAKING CHANGE và cũng là nơi tham chiếu đến Github issues mà commit này đã close. Breaking changes nên bắt đầu bằng từ BREAKING CHANGE: với khoảng trắng hoặc 2 dòng mới. Phần còn lại của message sau đó dùng cho việc này.

\* Các quy định khác

- Commit dùng viết thường. Ví dụ: "feat: implement feedback feature".

- Không dùng các description chung chung. Ví dụ: "fix: fix bug".

- Sử dụng thì bắt buộc là hiện tại: dùng "change", không dùng "changed" hoặc "changes"

- Không "chấm" (.) ở cuối commit.

- Khi đang code dở mà muốn commit, thì thêm "-WIP" (Working In Progress) vào cuối commit để Team hiểu rằng mình đang trong quá trình code chưa xong.

Vì sao phải dùng Conventional commits?

- Tự động tạo ra CHANGELOGs.

- Tự động xác định sematic version bump.

- Mô tả được chi tiết những thay đổi cho đồng đội, cộng đồng và các bên liên quan.

- Kích hoạt các quy trình build và publish.

- Làm cho mọi người dễ dàng hơn trong với đóng góp cho dự án, bằng cách cho họ xem một lịch sử commit có cấu trúc rõ ràng.

1. **Conventional setup branch: Chia branches thành 2 loại**

**Code flow branches**

Những nhánh mà Team để có sẵn vĩnh viễn trên git repository theo flow change bắt đầu từ khi development cho đến production

**\* Development** (nhánh develop)

Tất cả tính năng mới và sửa lỗi nên được đưa lên nhánh develop. Giải quyết conflicts nên được thực hiện sớm nhất ở nhánh này

**\* QA/Test** (nhánh test)

Chứa tất cả các mã codes sẵn sàng cho QA testing

**\* Staging** (nhánh staging, không bắt buộc)

Chứa các tính năng được thử nghiệm mà các bên liên quan muốn có sẵn cho bản demo hoặc một đề xuất trước khi nâng lên môi trường production. Các quyết định được đưa ra ở đây nếu một tính năng cuối cùng nên được đưa lên production.

**\* Production** (nhánh main)

Nhánh production, nếu repository được published, đây là nhánh mặc định được trình bày.

Ngoại trừ hotfix, tất cả các codes phải tuân theo sự merge một chiều bắt đầu từ development -\> test -\> staging -\> production

**Temporary branches**

Đây là các nhánh dùng một lần, có thể được tạo và xóa bởi nhu cầu phát triển hoặc người triển khai

**\* Feature** (nhánh feat)

Mọi thay đổi codes cho module mới hoặc trường hợp sử dụng nên được thực hiện trên một nhánh feat. Nhánh này được tạo ra dựa trên nhánh develop hiện tại. Khi tất cả các thay đổi được thực hiện, một yêu cầu pull/merge là cần thiết để đặt tất cả nhánh này vào nhánh develop

Ví dụ

- feat/implement-feedback-for-nhileteam

- feat/JIRA-1234

- feat/JIRA-1234\_implement-feedback-for-nhileteam

Nên sử dụng chữ cái thường và dấu gạch nối (-) để phân tách các từ trừ khi đó là tên hoặc ID cụ thể. Dấu gạch dưới (\_) có thể được sử dụng để tách ID và mô tả

**\* Bug fix** (nhánh fix)

Nếu code thay đổi được thực hiện từ nhánh feat đã bị từ chối sau khi release, sprint hoặc chạy demo, bất kì bản sửa lỗi cần thiết nào sau đó nên được thực hiện trên nhánh fix

Ví dụ

- fix/fix-cannot-send-feedback

- fix/JIRA-1222\_fix-cannot-send-feedback

**\* Hot fix** (nhánh hotfix)

Nếu cần phải sửa trên production gấp, thì thực hiện một bản vá tạm thời trên nhánh hotfix. Nhánh hotfix không tuân theo code flow branches và được merge trực tiếp vào nhánh production, và sau đó mới đến nhánh develop.

Ví dụ

- hotfix/disable-feedback-nhileteam

- hotfix/fix-cannot-load-ui

\* Build (nhánh build)

Một nhánh đặc biệt để tạo

**\* Release** (nhánh release)

Nhánh để gắn tag cụ thể cho phiên bản phát hành (release)

Ví dụ

- release/nhile-official-1.01.123

1. **Cách tạo pull request**

- Vào link pull request, review commit name, description

- Số file thay đổi nên nhỏ hơn 20 (trừ những Pull Request refactor source cần xóa, thay đổi nhiều files)

- Số commit nên nhỏ hơn 5

- Không có conflicts

- Review logic, syntax, tối ưu, clean code

- Pull code về máy để chạy và kiểm tra

- Approved pull request

- Merge pull request

- Xóa nhánh tạo pull request (trừ các nhánh chính main, develop, staging, production, test)

- Report lại cho người tạo pull request hoặc Scrum Master, Leader