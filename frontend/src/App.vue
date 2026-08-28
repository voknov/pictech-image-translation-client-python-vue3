<!-- src/App.vue -->

<template>
  <div id="app-container">
    <!-- 【Vue改造】左侧翻译记录栏 -->
    <aside id="history-sidebar">
      <h2>翻译记录</h2>
      <ul id="history-list">
        <!-- 【Vue改造】使用 v-for 动态渲染历史记录 -->
        <li
          v-for="(item, index) in translationHistory"
          :key="item.RequestId + '-' + index"
          :class="{ active: index === activeHistoryIndex }"
          @click="handleHistoryClick(index)"
        >
          <img :src="item.Data.SourceUrl" :alt="'历史记录' + index" />
        </li>
      </ul>
    </aside>

    <!-- 【Vue改造】右侧主内容区域，直接使用 ImageEditor 组件 -->
    <main id="main-content">
      <div id="editor-container-wrapper">
        <!--
          【Vue改造-组件通信】
          1. 使用 :initial-data="currentEditorData" 将当前选中的历史数据通过 prop 传递给子组件。
          2. 使用 @new-result="handleNewResult" 监听子组件触发的 newTranslationResult 事件。
          3. 使用 @save-result="handleSaveResult" 监听子组件触发的 saveTranslationResult 事件。
        -->
        <ImageEditor
          v-if="currentEditorData"
          :key="currentEditorData.RequestId"
          :initial-data="currentEditorData"
          @new-result="handleNewResult"
          @save-result="handleSaveResult"
          :button-config="myButtonConfig"
        />
      </div>
    </main>
  </div>
</template>

<script>
// 【Vue改造】导入 ImageEditor 组件

export default {
  name: 'App',
  data() {
    return {
      // 【Vue改造-状态管理】将 translationHistory 和 activeHistoryIndex 作为组件的状态
      translationHistory: [],
      activeHistoryIndex: -1,
      // 【Vue改造-状态管理】用于传递给子组件的数据
      currentEditorData: null,
      // 【Vue改造-状态管理】页面加载时使用的初始数据
      myButtonConfig: {
          upload: true,
          addText: true,
          restore: true, // 禁用局部恢复
          undo: true,
          redo: true,
          erase: true,   // 是否禁用擦除
          export: true,
          save: true,
          reset: true,
          compare: true,
        },
       initialApiResponse: {
	      Code: 200,
	      Data: {
	        FinalImageUrl: "https://pictech.top/pctccloud/pictech-api/afc19672d337880aa0a30360d058859f/20260828/1787884649044/20260828103724_151_final.webp",
	        InPaintingUrl: "https://pictech.top/pctccloud/pictech-api/afc19672d337880aa0a30360d058859f/20260828/1787884649044/20260828103724_151_inpaint.png",
	        SourceUrl: "https://pictech.top/pctccloud/pictechapi-translate/76ed13c2f50bf709b3b7fe67f0dd02c2/2026/08/28/20260828103724_151_a58c23ac.png",
	        TemplateJson: "{\"version\": \"5.3.0\", \"fabritor_schema_version\": 3, \"clipPath\": {\"type\": \"rect\", \"version\": \"5.3.0\", \"left\": 0, \"top\": 0, \"width\": 1980, \"height\": 2000, \"fill\": \"transparent\", \"selectable\": \"true\", \"hasControls\": \"true\"}, \"objects\": [{\"type\": \"rect\", \"version\": \"5.3.0\", \"originX\": \"left\", \"originY\": \"top\", \"left\": 0, \"top\": 0, \"width\": 1980, \"height\": 2000, \"fill\": \"transparent\", \"selectable\": \"false\", \"hasControls\": \"false\", \"id\": \"pictech\"}, {\"type\": \"f-image\", \"version\": \"5.3.0\", \"left\": 0, \"top\": 0, \"width\": 1980, \"height\": 2000, \"id\": \"pictech_1787884658217\", \"selectable\": \"true\", \"hasControls\": \"true\", \"objects\": [{\"type\": \"image\", \"version\": \"5.3.0\", \"originX\": \"left\", \"originY\": \"top\", \"left\": 0, \"top\": 0, \"width\": 1980, \"height\": 2000, \"src\": \"https://pictech.top/pctccloud/pictech-api/afc19672d337880aa0a30360d058859f/20260828/1787884649044/20260828103724_151_inpaint.png\", \"crossOrigin\": \"null\"}, {\"type\": \"rect\", \"version\": \"5.3.0\", \"originX\": \"left\", \"originY\": \"top\", \"left\": 0, \"top\": 0, \"width\": 1980, \"height\": 2000, \"fill\": \"#00000000\", \"paintFirst\": \"fill\"}]}, {\"type\": \"f-text\", \"version\": \"5.3.0\", \"originX\": \"left\", \"originY\": \"center\", \"left\": 1303.0, \"top\": 354.5, \"width\": 778.1666666666667, \"fill\": \"#76AFC8\", \"stroke\": \"null\", \"strokeWidth\": 0, \"paintFirst\": \"stroke\", \"angle\": 0.0, \"scaleX\": 0.96, \"scaleY\": 1, \"charSpacing\": -40, \"fontFamily\": \"Noto Sans SC\", \"fontWeight\": \"bold\", \"fontSize\": 111.0, \"text\": \"Foggy Brown\", \"itext\": \"1\", \"originalText\": \"雾冷棕\", \"targetLang\": \"ENG\", \"textAlign\": \"left\", \"lineHeight\": 0.95, \"styles\": [], \"pathAlign\": \"center\", \"minWidth\": 20, \"splitByGrapheme\": false, \"voknovPreventInitialWrap\": true, \"voknovVerticalCjkUpright\": false, \"voknovWritingMode\": \"horizontal-or-rotated\", \"voknovOriginalAngle\": null, \"voknovRenderAngle\": null, \"id\": \"txt_7aba3bb6-a289-11f1-a7a3-d0946605de23\", \"selectable\": \"true\", \"hasControls\": \"true\"}, {\"type\": \"f-text\", \"version\": \"5.3.0\", \"originX\": \"left\", \"originY\": \"center\", \"left\": 1331.0, \"top\": 585.5, \"width\": 529.76, \"fill\": \"#7EB1CA\", \"stroke\": \"null\", \"strokeWidth\": 0, \"paintFirst\": \"stroke\", \"angle\": 0.0, \"scaleX\": 1.0, \"scaleY\": 1, \"charSpacing\": 18, \"fontFamily\": \"Noto Sans SC\", \"fontWeight\": \"bold\", \"fontSize\": 83.0, \"text\": \"No fading\", \"itext\": \"1\", \"originalText\": \"无需褪色\", \"targetLang\": \"ENG\", \"textAlign\": \"left\", \"lineHeight\": 0.95, \"styles\": [], \"pathAlign\": \"center\", \"minWidth\": 20, \"splitByGrapheme\": false, \"voknovPreventInitialWrap\": true, \"voknovVerticalCjkUpright\": false, \"voknovWritingMode\": \"horizontal-or-rotated\", \"voknovOriginalAngle\": null, \"voknovRenderAngle\": null, \"id\": \"txt_7aba3efe-a289-11f1-a7a3-d0946605de23\", \"selectable\": \"true\", \"hasControls\": \"true\"}, {\"type\": \"f-text\", \"version\": \"5.3.0\", \"originX\": \"left\", \"originY\": \"center\", \"left\": 1206.0, \"top\": 742.5, \"width\": 753.9583333333334, \"fill\": \"#477F8F\", \"stroke\": \"null\", \"strokeWidth\": 0, \"paintFirst\": \"stroke\", \"angle\": 0.0, \"scaleX\": 0.96, \"scaleY\": 1, \"charSpacing\": -32, \"fontFamily\": \"Noto Sans SC\", \"fontWeight\": \"bold\", \"fontSize\": 40.0, \"text\": \"Suitable for skin tones: All skin tones\", \"itext\": \"1\", \"originalText\": \"适合肤色：全部肤色\", \"targetLang\": \"ENG\", \"textAlign\": \"left\", \"lineHeight\": 0.95, \"styles\": [], \"pathAlign\": \"center\", \"minWidth\": 20, \"splitByGrapheme\": false, \"voknovPreventInitialWrap\": true, \"voknovVerticalCjkUpright\": false, \"voknovWritingMode\": \"horizontal-or-rotated\", \"voknovOriginalAngle\": null, \"voknovRenderAngle\": null, \"id\": \"txt_7aba420a-a289-11f1-a7a3-d0946605de23\", \"selectable\": \"true\", \"hasControls\": \"true\"}, {\"type\": \"f-text\", \"version\": \"5.3.0\", \"originX\": \"left\", \"originY\": \"center\", \"left\": 1206.0, \"top\": 871.0, \"width\": 670.1020408163265, \"fill\": \"#487E8D\", \"stroke\": \"null\", \"strokeWidth\": 0, \"paintFirst\": \"stroke\", \"angle\": 0.0, \"scaleX\": 0.98, \"scaleY\": 1, \"charSpacing\": -24, \"fontFamily\": \"Noto Sans SC\", \"fontWeight\": \"bold\", \"fontSize\": 40.0, \"text\": \"Suitable for age: 18-38 years old\", \"itext\": \"1\", \"originalText\": \"适合年龄：18-38岁\", \"targetLang\": \"ENG\", \"textAlign\": \"left\", \"lineHeight\": 0.95, \"styles\": [], \"pathAlign\": \"center\", \"minWidth\": 20, \"splitByGrapheme\": false, \"voknovPreventInitialWrap\": true, \"voknovVerticalCjkUpright\": false, \"voknovWritingMode\": \"horizontal-or-rotated\", \"voknovOriginalAngle\": null, \"voknovRenderAngle\": null, \"id\": \"txt_7aba448a-a289-11f1-a7a3-d0946605de23\", \"selectable\": \"true\", \"hasControls\": \"true\"}, {\"type\": \"f-text\", \"version\": \"5.3.0\", \"originX\": \"left\", \"originY\": \"center\", \"left\": 975.0, \"top\": 1000.0, \"width\": 80.0, \"fill\": \"#D1C7B7\", \"stroke\": \"null\", \"strokeWidth\": 0, \"paintFirst\": \"stroke\", \"angle\": 0.0, \"scaleX\": 1.0, \"scaleY\": 1, \"charSpacing\": 18, \"fontFamily\": \"Noto Sans SC\", \"fontWeight\": \"bold\", \"fontSize\": 27.0, \"text\": \"Ten\", \"itext\": \"1\", \"originalText\": \"十\", \"targetLang\": \"ENG\", \"textAlign\": \"left\", \"lineHeight\": 0.95, \"styles\": [], \"pathAlign\": \"center\", \"minWidth\": 20, \"splitByGrapheme\": false, \"voknovPreventInitialWrap\": true, \"voknovVerticalCjkUpright\": false, \"voknovWritingMode\": \"horizontal-or-rotated\", \"voknovOriginalAngle\": null, \"voknovRenderAngle\": null, \"id\": \"txt_7aba45ac-a289-11f1-a7a3-d0946605de23\", \"selectable\": \"true\", \"hasControls\": \"true\"}, {\"type\": \"f-text\", \"version\": \"5.3.0\", \"originX\": \"left\", \"originY\": \"center\", \"left\": 1209.0, \"top\": 986.0, \"width\": 758.2978723404257, \"fill\": \"#498292\", \"stroke\": \"#C4DBE3\", \"strokeWidth\": 4.058, \"paintFirst\": \"stroke\", \"angle\": 0.0, \"scaleX\": 0.94, \"scaleY\": 1, \"charSpacing\": -40, \"fontFamily\": \"Noto Sans SC\", \"fontWeight\": \"bold\", \"fontSize\": 40.0, \"text\": \"Enhances complexion, brightens skin\", \"itext\": \"1\", \"originalText\": \"颜色特点：衬肤显白\", \"targetLang\": \"ENG\", \"textAlign\": \"left\", \"lineHeight\": 0.95, \"styles\": [], \"pathAlign\": \"center\", \"minWidth\": 20, \"splitByGrapheme\": false, \"voknovPreventInitialWrap\": true, \"voknovVerticalCjkUpright\": false, \"voknovWritingMode\": \"horizontal-or-rotated\", \"voknovOriginalAngle\": null, \"voknovRenderAngle\": null, \"id\": \"txt_7aba4822-a289-11f1-a7a3-d0946605de23\", \"selectable\": \"true\", \"hasControls\": \"true\"}, {\"type\": \"f-text\", \"version\": \"5.3.0\", \"originX\": \"center\", \"originY\": \"center\", \"left\": 1576.0, \"top\": 1390.0, \"width\": 495.0, \"fill\": \"#F7F7F6\", \"stroke\": \"null\", \"strokeWidth\": 0, \"paintFirst\": \"stroke\", \"angle\": 0.0, \"scaleX\": 1.0, \"scaleY\": 1, \"charSpacing\": 0, \"fontFamily\": \"Noto Sans SC\", \"fontWeight\": \"bold\", \"fontSize\": 63.0, \"text\": \"Foggy Brown\", \"itext\": \"1\", \"originalText\": \"雾冷棕\", \"targetLang\": \"ENG\", \"textAlign\": \"center\", \"lineHeight\": 0.95, \"styles\": [], \"pathAlign\": \"center\", \"minWidth\": 20, \"splitByGrapheme\": false, \"voknovPreventInitialWrap\": true, \"voknovVerticalCjkUpright\": false, \"voknovWritingMode\": \"horizontal-or-rotated\", \"voknovOriginalAngle\": null, \"voknovRenderAngle\": null, \"id\": \"txt_7aba499e-a289-11f1-a7a3-d0946605de23\", \"selectable\": \"true\", \"hasControls\": \"true\"}, {\"type\": \"f-text\", \"version\": \"5.3.0\", \"originX\": \"center\", \"originY\": \"center\", \"left\": 1541.0, \"top\": 1761.0, \"width\": 858.6666666666667, \"fill\": \"#468097\", \"stroke\": \"null\", \"strokeWidth\": 0, \"paintFirst\": \"stroke\", \"angle\": 0.0, \"scaleX\": 0.96, \"scaleY\": 1, \"charSpacing\": -40, \"fontFamily\": \"Noto Sans SC\", \"fontWeight\": \"bold\", \"fontSize\": 72.0, \"text\": \"Buy One, Get One Free\", \"itext\": \"1\", \"originalText\": \"买一盒送一盒\", \"targetLang\": \"ENG\", \"textAlign\": \"center\", \"lineHeight\": 0.95, \"styles\": [], \"pathAlign\": \"center\", \"minWidth\": 20, \"splitByGrapheme\": false, \"voknovPreventInitialWrap\": true, \"voknovVerticalCjkUpright\": false, \"voknovWritingMode\": \"horizontal-or-rotated\", \"voknovOriginalAngle\": null, \"voknovRenderAngle\": null, \"id\": \"txt_7aba4b7e-a289-11f1-a7a3-d0946605de23\", \"selectable\": \"true\", \"hasControls\": \"true\"}]}"
	      },
	      Message: "翻译完成",
	      RequestId: "c0b49143-0c92-429f-a54a-2c7288864578"
      }
    };
  },
  // 【Vue改造-生命周期】在 mounted 钩子中加载初始数据
  mounted() {
    // 页面加载时，将初始数据添加到历史记录中
    this.addHistoryItem(this.initialApiResponse, true);
  },
  methods: {
    /**
     * 【Vue改造】添加或更新历史记录项
     * @param {object} apiResponse - API 响应数据
     * @param {boolean} isNewTranslation - 标记是否为一次全新的翻译（需要将数据加载到编辑器）
     */
    addHistoryItem(apiResponse, isNewTranslation = false) {
      const newRequestId = apiResponse.RequestId;
      const existingIndex = this.translationHistory.findIndex(item => item.RequestId === newRequestId);

      if (existingIndex !== -1) {
        // 如果 RequestId 已存在，则用新数据更新它（通常发生在保存操作后）
        // Vue 3 可以直接侦测数组索引赋值
        this.translationHistory[existingIndex] = apiResponse;
        console.log(`[App.vue] 历史记录更新于索引 #${existingIndex}`);
      } else {
        // 如果是新的 RequestId，则添加到历史记录数组的开头
        this.translationHistory.unshift(apiResponse);
        this.activeHistoryIndex = 0; // 自动激活新项
        console.log(`[App.vue] 新增历史记录，当前激活索引: ${this.activeHistoryIndex}`);
      }

      // 如果是一次新的翻译（或首次加载），则更新需要传递给子组件的数据
      if (isNewTranslation) {
          this.currentEditorData = apiResponse;
      }
    },

    /**
     * 【Vue改造】处理左侧历史记录的点击事件
     * @param {number} index - 被点击项的索引
     */
    handleHistoryClick(index) {
      if (index !== this.activeHistoryIndex) {
        console.log(`[App.vue] 切换到历史记录 #${index}`);
        this.activeHistoryIndex = index;
        // 更新 currentEditorData，Vue 的响应式系统会自动将新 prop 传递给子组件
        this.currentEditorData = this.translationHistory[index];
      }
    },

    /**
     * 【Vue改造-组件通信】处理子组件发出的“新结果”事件
     * @param {object} payload - 从子组件传递过来的新翻译结果
     */
    handleNewResult(payload) {
        console.log('[App.vue] 从 ImageEditor 收到 new-result 事件:', payload);
        // 调用 addHistoryItem，并标记为新翻译，以加载到编辑器
        this.addHistoryItem(payload, true);
    },

    /**
     * 【Vue改造-组件通信】处理子组件发出的“保存结果”事件
     * @param {object} payload - 从子组件传递过来的保存后的数据
     */
    handleSaveResult(payload) {
        console.log('[App.vue] 从 ImageEditor 收到 save-result 事件:', payload);
        // 调用 addHistoryItem，但不标记为新翻译，仅更新历史记录中的数据
        this.addHistoryItem(payload, false);
    }
  },
};
</script>

<!-- src/App.vue -->

<style>
/* 【Vue改造】从原 index.html 复制过来的样式 */
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  background-color: #f0f2f5;
  overflow: hidden;
}

#app-container {
  display: flex;
  height: 100vh;
}

#history-sidebar {
  width: 200px;
  flex-shrink: 0;
  background-color: #ffffff;
  border-right: 1px solid #dcdfe6;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

#history-sidebar h2 {
  font-size: 16px;
  color: #303133;
  margin: 0;
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
}

#history-list {
  list-style-type: none;
  padding: 8px;
  margin: 0;
  overflow-y: auto;
  flex-grow: 1;
}

#history-list li {
  padding: 5px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
  border: 2px solid transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}

#history-list li.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

#history-list li:hover {
  background-color: #f5f7fa;
}

#history-list li img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
  background-color: #e4e7ed;
}

#main-content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f0f2f5;
}

#editor-container-wrapper {
  width: 100%;
  height: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  /* 【Vue改造】让子组件能100%填充 */
  position: relative;

  /* 【关键修复】将 wrapper 自身设为 flex 容器 */
  /* 这会强制其唯一的子元素 <ImageEditor> 自动撑满它的所有空间 */
  display: flex;
}
</style>
