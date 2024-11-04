import {
    app,
    BrowserWindow,
    WebContents,
    WebPreferences,
    Event,
} from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __dirname: string = path.dirname(fileURLToPath(import.meta.url));

function createWindow(): void {
    const win: BrowserWindow = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,
        } as WebPreferences,
        backgroundColor: "#fff",
        autoHideMenuBar: true,
        show: false,
    });

    win.once("ready-to-show", (): void => {
        win.show();
    });

    if (process.env.VITE_DEV) {
        win.loadURL("http://localhost:5173");

        win.webContents.on("did-frame-finish-load", (): void => {
            win.webContents.setZoomLevel(0);
            win.webContents.openDevTools({ mode: "detach" });
        });
    } else {
        // 프로덕션 환경에서의 경로 수정
        const indexPath = path.join(__dirname, "..", "index.html");
        console.log("Loading file from:", indexPath);  // 디버깅용
        win.loadFile(indexPath).catch(e => console.error('Failed to load file:', e));
        
        // 프로덕션 환경에서도 개발자 도구 열기 (디버깅용)
        // win.webContents.openDevTools();
    }

    win.webContents.on("devtools-opened", (): void => {
        win.focus();
    });
}

app.whenReady().then((): void => {
    // DevTools 관련 코드 제거 (타입 에러 발생 부분)
    createWindow();
});

app.on("window-all-closed", (): void => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", (): void => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

process.on("uncaughtException", (error: Error): void => {
    console.error("Uncaught Exception:", error);
});
