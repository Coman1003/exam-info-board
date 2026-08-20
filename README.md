# 考場資訊看板系統 (Exam Info Board)

此專案提供 **原生 HTML + CSS + JavaScript** 的考場資訊看板，可直接在瀏覽器開啟：

- `index.html`：大屏顯示頁（即時時鐘、現在考試科目、考程表、人數統計、編輯模態）
- `admin.html`：管理頁（完整編輯區 + 即時預覽）

## 主要功能

- 實時時間顯示（每秒更新，格式 `YYYY-MM-DD HH:MM:SS`）
- 現在考試科目高亮與閃爍動畫
- 考程狀態標示（進行中 / 已考完 / 未開始）
- 考場人數統計卡片
- 編輯功能（新增/刪除科目、統計設定、當前科目切換）
- LocalStorage 資料持久化

## 使用方式

直接開啟以下檔案：

- `index.html`
- `admin.html`

## 檔案結構

```text
exam-info-board/
├── index.html
├── admin.html
├── css/
│   ├── style.css
│   ├── theme.css
│   └── animations.css
├── js/
│   ├── app.js
│   ├── storage.js
│   ├── clock.js
│   ├── validator.js
│   └── ui.js
└── README.md
```
