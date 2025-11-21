# Sheet Logger Proxy (Vercel)

Proxy API để GPTs có thể log dữ liệu vào Google Sheet thông qua Google Apps Script Web App.

## Cấu trúc

- `api/log-chat.js`: Serverless function trên Vercel.
- `package.json`: Cấu hình Node.
- `vercel.json`: Chỉ định runtime Node 20.

## Cách dùng

1. Push repo này lên GitHub.
2. Trên Vercel:
   - New Project → Import from GitHub → chọn repo.
   - Giữ cấu hình mặc định, Deploy.
3. Sau deploy, Vercel sẽ cấp domain dạng:
   - `https://your-project-name.vercel.app`
4. Endpoint proxy:
   - `POST https://your-project-name.vercel.app/api/log-chat`
   - Body JSON:
     ```json
     {
       "prompt": "User hỏi gì đó...",
       "response": "Assistant trả lời...",
       "model": "gpt-5.1-thinking"
     }
     ```

5. API này sẽ forward body sang Apps Script Web App và trả lại nguyên response của Apps Script.
