import React from "react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode: boolean;
    isScientific: boolean;
    isRadianMode: boolean;
    onThemeChange: (isDark: boolean) => void;
    onModeChange: (scientific: boolean) => void;
    onAngleModeChange: (isRadian: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({
    isOpen,
    onClose,
    isDarkMode,
    isScientific,
    isRadianMode,
    onThemeChange,
    onModeChange,
    onAngleModeChange,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>설정</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    {/* 다크 모드 설정 */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label htmlFor="dark-mode">다크 모드</Label>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                어두운 테마를 사용합니다
                            </p>
                        </div>
                        <Switch
                            id="dark-mode"
                            checked={isDarkMode}
                            onCheckedChange={onThemeChange}
                        />
                    </div>

                    {/* 계산기 모드 설정 */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label htmlFor="calculator-mode">
                                공학용 계산기
                            </Label>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                고급 수학 함수를 사용합니다
                            </p>
                        </div>
                        <Switch
                            id="calculator-mode"
                            checked={isScientific}
                            onCheckedChange={onModeChange}
                        />
                    </div>

                    {/* 각도 모드 설정 */}
                    {isScientific && (
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="angle-mode">라디안 모드</Label>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    각도 대신 라디안을 사용합니다
                                </p>
                            </div>
                            <Switch
                                id="angle-mode"
                                checked={isRadianMode}
                                onCheckedChange={onAngleModeChange}
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Settings;
