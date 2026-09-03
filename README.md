# 📘 PicTech 图片翻译编辑器 - Python 后端版

本项目是一个集成在线图片编辑与多语言翻译功能的全栈解决方案。前端使用 Vue 3.5，并集成 `vue-pic-tech-editor 2.0.2`；后端由 Python FastAPI 驱动，提供翻译、保存、导出和擦除 API，同时托管编译后的前端静态文件，实现前后端一体化部署。

## ✨ 项目特点
- **前端**：基于 Vue 3.5、Vue CLI 5 和 `vue-pic-tech-editor 2.0.2`，支持裁剪、局部恢复、文字恢复、擦除、导出和保存。
- **后端**：Python 3.8+ 与 FastAPI，高效处理异步 API 请求。
- **API 客户端**：内置与第三方 PicTech 图片处理服务的通信客户端。
- **一体化部署**：FastAPI 后端直接提供前端静态资源，简化部署流程。
- **配置灵活**：使用 `.env` 文件管理敏感配置（如 API 密钥）。
- **跨域支持**：默认启用 CORS，方便前后端分离开发与调试。

## 📂 项目结构
```
/                        # 项目根目录
|-- backend/             # 后端 Python 代码
|   |-- app/             # FastAPI 应用核心代码
|   |   |-- main.py      # FastAPI 应用入口
|   |   |-- routers/     # API 路由定义
|   |   |-- services/    # 业务逻辑层
|   |   |-- clients/     # PicTech API 客户端
|   |   `-- models/      # 数据模型
|   |-- venv/            # Python 虚拟环境
|   |-- requirements.txt # Python 依赖列表
|   `-- .env             # 本地环境变量（自行创建，请勿提交）
|
|-- frontend/            # 前端 Vue 源代码
|   |-- dist/            # (编译后生成) 静态文件目录
|   |-- public/          # 静态资源，如 index.html
|   |-- src/             # Vue 应用核心代码
|   |   |-- App.vue      # 编辑器页面与翻译记录状态
|   |   `-- main.js      # Vue 3 入口与编辑器插件配置
|   |-- vue.config.js    # Vue CLI 配置文件
|   `-- package.json     # 前端依赖与脚本
|
|-- uploads/             # (自动生成) 用户上传图片保存目录
|
|-- run.py               # 项目统一启动脚本
|
`-- README.md            # 本文档
```

### 📁 前端结构与说明
- **public/**：包含 `index.html` 等静态资源。Fabric.js 已由插件的 npm 依赖提供，不需要在页面中手动加载全局脚本。
- **src/**：前端 Vue 应用的核心代码。
  - **App.vue**：承载由 `vue-pic-tech-editor` 全局注册的 `ImageEditor`，并管理翻译记录、当前编辑数据和按钮配置。
    - **按钮配置**：`App.vue` 的 `data` 中定义了 `myButtonConfig` 对象，用于控制编辑器界面中按钮的显示与隐藏。配置如下：
      ```javascript
      myButtonConfig: {
          upload: true,    // 启用文件上传按钮，允许用户上传图片
          addText: true,   // 启用添加文本按钮，支持在图片上添加翻译文本
          restore: true,   // 启用局部恢复按钮，用于恢复擦除区域
          crop: true,      // 启用裁剪按钮，默认选区覆盖完整图片
          undo: true,      // 启用撤销按钮，回退上一步操作
          redo: true,      // 启用重做按钮，恢复已撤销的操作
          erase: true,     // 启用擦除按钮，支持擦除图片指定区域
          export: true,    // 启用导出按钮，生成最终图片
          save: true,      // 启用保存按钮，保存当前画布状态
          reset: true,      // 启用重置按钮，重置画布到初始状态
          compare: true,     // 启用原图对照按钮

      }
      ```
      通过将上述选项设置为 `true` 或 `false`，可动态控制按钮的显示，满足不同场景下的用户体验需求。例如，禁用 `erase` 可隐藏擦除功能。
  - **main.js**：使用 Vue 3 的 `createApp()` 创建应用，通过 `app.use(ImageEditorPlugin, { apiConfig })` 注册插件，并引入插件 CSS。
- **vue.config.js**：Vue CLI 配置文件，已配置将构建产物输出到 `frontend/dist/` 目录，并由 FastAPI 后端托管。
- **dist/**：前端编译后生成的静态文件（HTML、CSS、JS），由 `npm run build` 自动生成，供 FastAPI 后端直接提供。

### 🆕 2.0.2 接入说明

- `App.vue` 不再依赖硬编码的演示图片，使用 `{ Data: {} }` 创建空白编辑器，首次进入页面即可上传图片。
- `buttonConfig.crop` 控制裁剪入口；进入裁剪时选区默认覆盖整张图片，可拖动单独的边或角调整范围。
- 局部恢复与文字恢复由编辑器内部处理：文字状态仅显示“恢复原图”，恢复为原图后仅显示“恢复文字”。
- 擦除、局部恢复生成的新底图通过 `UPLOAD_IO_IN_PAINT_IMG_API` 上传，FastAPI 返回 `/uploads/...` 地址。
- 开发服务器已代理 `/api` 和 `/uploads` 到 `http://localhost:8000`，保证本地开发时接口和恢复图片都可正常访问。

插件注册与接口配置位于 `frontend/src/main.js`：

```javascript
app.use(ImageEditorPlugin, {
  apiConfig: {
    UPLOAD_API: '/api/translate/upload',
    URL_API: '/api/translate/url',
    RESULT_API: '/api/translate/result',
    SAVE_API: '/api/translate/save',
    UPLOAD_EXPORT_IMG_API: '/api/translate/uploadExportedImage',
    IO_IN_PAINT_API: '/api/translate/iopaint',
    UPLOAD_IO_IN_PAINT_IMG_API: '/api/translate/uploadIoInpaintImage',
  },
})
```

### 📄 API 接口
所有后端接口定义在 `backend/app/routers/translate.py` 中，根路径为 `/api/translate`。
- **POST /api/translate/upload**：处理用户上传图片的翻译任务。
- **POST /api/translate/url**：处理基于 URL 的图片翻译任务。
- **POST /api/translate/save**：保存编辑器当前画布状态。
- **POST /api/translate/uploadExportedImage**：接收并保存前端导出的最终图片，建议定期清理。
- **GET /api/translate/result/{request_id}**：查询指定翻译任务的处理结果。
- **POST /api/translate/iopaint**：请求图片擦除服务。
- **POST /api/translate/uploadIoInpaintImage**：保存擦除操作的中间结果，建议定期清理。

## 🚀 运行指南

### 1️⃣ 先决条件
确保系统已安装以下软件：
- **Python 3.8+**：用于运行 FastAPI 后端。
- **Node.js 16.x+（含 npm）**：用于 Vue 3.5 前端开发与构建。
- **Git**（可选）：用于版本控制。

### 2️⃣ 后端配置
#### 2.1 创建并激活虚拟环境
```bash
# 进入后端目录
cd backend

# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
# macOS / Linux
source venv/bin/activate
# Windows
venv\Scripts\activate
```

#### 2.2 安装依赖
```bash
pip install -r requirements.txt
```

#### 2.3 配置环境变量
在 `backend/` 目录下创建 `.env`，填写 PicTech API 相关信息，不要将真实密钥提交到 Git：
```dotenv
# .env 文件内容
PICOTECH_BASE_URL="http://example.com"
PICOTECH_API_KEY="你的AccountId"
PICOTECH_SECRET="你的SecretKey"

# 文件上传目录
UPLOAD_DIR="uploads"
```

- **PICOTECH_BASE_URL**：PicTech API 的基础 URL。
- **PICOTECH_API_KEY** 和 **PICOTECH_SECRET**：PicTech API 的凭证，用于调用图片处理服务。
- **UPLOAD_DIR**：用于存放用户上传的图片及程序生成的文件，项目启动时自动创建。

### 3️⃣ 前端配置与编译

当前前端核心版本：

- `vue@3.5.x`
- `vue-pic-tech-editor@2.0.2`
- `@vue/compiler-sfc@3.5.x`

#### 3.1 安装依赖
```bash
cd frontend
npm install
```

可以执行以下命令确认没有残留 Vue 2 编译器：

```bash
npm ls vue vue-pic-tech-editor @vue/compiler-sfc vue-template-compiler --depth=0
```

#### 3.2 编译前端
```bash
npm run build
```
- 编译完成后，静态文件将生成在 `frontend/dist/` 目录。
- FastAPI 后端会自动从此目录提供静态资源，无需额外配置。

### 4️⃣ 启动应用
返回项目根目录，运行统一启动脚本：
```bash
cd ..
python run.py
```

启动成功后，控制台将显示类似以下日志：
```
INFO:     Started server process [12345]
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

### 5️⃣ 访问应用
在浏览器中打开：
```
http://localhost:8000
```
您将看到 Vue 3.5 前端界面，所有 API 请求由 FastAPI 后端处理。可以通过上传图片、编辑、翻译等功能体验完整的图片翻译编辑器。

## 💡 开发模式提示
- **后端热重载**：`run.py` 已启用 Uvicorn 的热重载功能，修改后端代码后服务会自动重启。
- **前端热重载**：在 `frontend/` 目录下运行以下命令启动 Vue 开发服务器：
  ```bash
  npm run serve
  ```
  - 默认运行在 `http://localhost:8080`。
  - `src/main.js` 使用 `/api/translate/*` 相对地址。开发服务器运行在 8080 端口时，可将 `vue.config.js` 配置为以下内容，把 `/api` 请求转发到 FastAPI 后端：
    ```javascript
    const path = require('path')

    module.exports = {
      outputDir: path.resolve(__dirname, './dist'),
      indexPath: 'index.html',
      publicPath: './',
      devServer: {
        proxy: {
          '/api': {
            target: 'http://localhost:8000',
            changeOrigin: true,
          },
          '/uploads': {
            target: 'http://localhost:8000',
            changeOrigin: true,
          },
        },
      },
    }
    ```

## 🤝 贡献
欢迎提交 Issue 或 Pull Request 来报告 Bug 或提出改进建议！请确保代码符合项目编码规范，并附上详细的描述。
