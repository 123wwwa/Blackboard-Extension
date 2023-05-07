// vite.config.ts
import { defineConfig } from "file:///D:/WebTests/bb-repo/node_modules/vite/dist/node/index.js";
import react from "file:///D:/WebTests/bb-repo/node_modules/@vitejs/plugin-react/dist/index.mjs";
import svgr from "file:///D:/WebTests/bb-repo/node_modules/vite-plugin-svgr/dist/index.mjs";
import { crx } from "file:///D:/WebTests/bb-repo/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "BlackBoard Extension",
  version: "1.0.0",
  action: {
    default_title: "Popup",
    default_popup: "index.html",
    default_icon: "logo192.png"
  },
  permissions: [
    "storage",
    "alarms",
    "activeTab",
    "webRequest"
  ],
  icons: {},
  content_scripts: [
    {
      matches: ["https://blackboard.unist.ac.kr/webapps/portal/execute/tabs/*"],
      js: [
        "src/content-script/GetLectureInfo/getLectureInfo.tsx"
      ],
      media: []
    },
    {
      matches: ["<all_urls>"],
      js: ["src/content-script/GetMylab/getmylab.js"],
      all_frames: true
    },
    {
      matches: ["https://blackboard.unist.ac.kr/*"],
      js: ["src/content-script/TimeTable/main.tsx", "src/content-script/Todo/main.tsx", "src/content-script/CancelLogout/CancelLogout.js"],
      media: []
    },
    {
      matches: ["https://blackboard.unist.ac.kr/webapps/assignment/uploadAssignment*"],
      js: ["src/content-script/LoadAssignment/loadfile.js"]
    },
    {
      matches: ["https://blackboard.unist.ac.kr/webapps/blackboard/content/listContent.jsp*"],
      js: ["src/content-script/AssignmentList/assignmentList.tsx"]
    }
  ],
  host_permissions: [
    "<all_urls>"
  ],
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self'",
    sandbox: "sandbox allow-scripts; script-src 'self'; object-src 'self'"
  },
  web_accessible_resources: [
    {
      resources: [
        "public/assets/lectureInfo.json",
        "public/assets/HeXA_logo.png",
        "public/icons/*.png"
      ],
      matches: ["<all_urls>"]
    },
    {
      resources: [
        "src/content-script/LoadAssignment/loadfile-append.js",
        "src/content-script/CancelLogout/CancelLogout-append.js"
      ],
      matches: ["https://blackboard.unist.ac.kr/*"]
    },
    {
      resources: [
        "src/content-script/GetMylab/getmylab-append.js"
      ],
      matches: ["<all_urls>"],
      all_frames: true
    }
  ]
};

// vite.config.ts
var vite_config_default = defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"]
      }
    }),
    svgr({
      svgrOptions: {
        icon: true
      }
    }),
    crx({ manifest: manifest_default })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxXZWJUZXN0c1xcXFxiYi1yZXBvXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxXZWJUZXN0c1xcXFxiYi1yZXBvXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9XZWJUZXN0cy9iYi1yZXBvL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgc3ZnciBmcm9tICd2aXRlLXBsdWdpbi1zdmdyJ1xyXG5pbXBvcnQgeyBjcnggfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nXHJcbmltcG9ydCBtYW5pZmVzdCBmcm9tICcuL21hbmlmZXN0Lmpzb24nXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KHtcclxuICAgICAganN4SW1wb3J0U291cmNlOiBcIkBlbW90aW9uL3JlYWN0XCIsXHJcbiAgICAgIGJhYmVsOiB7XHJcbiAgICAgICAgcGx1Z2luczogWydAZW1vdGlvbi9iYWJlbC1wbHVnaW4nXVxyXG4gICAgICB9XHJcbiAgICB9KSxcclxuICAgIHN2Z3Ioe1xyXG4gICAgICBzdmdyT3B0aW9uczoge1xyXG4gICAgICAgIGljb246IHRydWUsXHJcbiAgICAgICAgLy8gLi4uc3ZnciBvcHRpb25zIChodHRwczovL3JlYWN0LXN2Z3IuY29tL2RvY3Mvb3B0aW9ucy8pXHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICAgIC8vIEJ1aWxkIENocm9tZSBFeHRlbnNpb25cclxuICAgIGNyeCh7IG1hbmlmZXN0IH0pLFxyXG4gIF1cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpUCxTQUFTLG9CQUFvQjtBQUM5USxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsV0FBVzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJcEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLE1BQ0osaUJBQWlCO0FBQUEsTUFDakIsT0FBTztBQUFBLFFBQ0wsU0FBUyxDQUFDLHVCQUF1QjtBQUFBLE1BQ25DO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxLQUFLO0FBQUEsTUFDSCxhQUFhO0FBQUEsUUFDWCxNQUFNO0FBQUEsTUFFUjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBRUQsSUFBSSxFQUFFLDJCQUFTLENBQUM7QUFBQSxFQUNsQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
