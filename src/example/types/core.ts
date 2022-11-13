export type ViewStoreInjectedData = {
    globalConfig: { baseApiUrl: string; };
    appService: { serviceMap: Record<string, unknown>; };
    notifyService: (type: 'error' | 'success', message: string) => void;
};