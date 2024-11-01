import { app, BrowserWindow, WebContents, WebPreferences } from "electron";
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
        win.loadFile(path.join(__dirname, "../index.html"));
    }

    win.webContents.on("devtools-opened", (): void => {
        win.focus();
    });
}

app.whenReady().then((): void => {
    app.on(
        "web-contents-created",
        (_event: Event, contents: WebContents): void => {
            contents.on(
                "will-attach-webview",
                (
                    _event: Event,
                    webPreferences: WebPreferences,
                    _params: Record<string, unknown>
                ): void => {
                    delete webPreferences.enableBlinkFeatures;
                }
            );
        }
    );

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
