/**
 * 翻译配置管理模块
 * 负责统一管理翻译配置、与服务器同步配置、通知配置变更
 */

const TranslationConfigManager = {
    config: null,
    listeners: [],
    uiListeners: [], // UI更新监听器
    configTime: 0, // 配置时间戳，用于判断配置新旧
    
    // 初始化配置
    initialize: function(config) {
        if (!config) {
            console.warn('初始化配置：提供的配置数据为空');
            return;
        }

        const configTime = config.time || Date.now();
        if (!this.config || !this.configTime || configTime > this.configTime) {
            console.log(`初始化翻译配置，时间戳: ${configTime}`);
            this.config = config;
            this.configTime = configTime;
            this.notifyListeners();
            this.notifyUIListeners();
        }
    },
    
    // 获取当前配置
    getConfig: function() {
        return this.config;
    },
    
    // 获取当前活跃的翻译服务
    getActiveService: function() {
        if (!this.config) {
            console.warn('配置未初始化，返回默认服务: google');
            return 'google';
        }
        return this.config.active_service || 'google';
    },
    
    // 获取当前活跃的配置名称
    getActiveConfig: function() {
        if (!this.config) {
            console.warn('配置未初始化，返回默认配置: default');
            return 'default';
        }
        return this.config.active_config || 'default';
    },

    // 获取服务配置
    getServiceConfig: function(service, configName = 'default') {
        if (!this.config || !this.config.services || !this.config.services[service]) {
            return null;
        }

        const serviceConfigs = this.config.services[service].configs;
        if (!serviceConfigs || !serviceConfigs[configName]) {
            return null;
        }

        const config = serviceConfigs[configName];
        // 确保配置中包含并发请求数设置
        if (!config.hasOwnProperty('max_concurrent_requests')) {
            config.max_concurrent_requests = 3; // 默认值
        }
        return config;
    },

    // 更新服务配置
    updateServiceConfig: function(service, configName, newConfig) {
        if (!this.config.services[service] || !this.config.services[service].configs[configName]) {
            console.error('服务或配置不存在:', service, configName);
            return false;
        }

        // 合并配置，保留原有字段
        const currentConfig = this.config.services[service].configs[configName];
        Object.assign(currentConfig, newConfig);

        // 只更新内存中的配置，不同步到服务器
        return true;
    },

    // 获取服务的并发请求数
    getServiceConcurrentRequests: function(service, configName = 'default') {
        if (!service) {
            service = this.getActiveService();
        }
        if (!configName) {
            configName = this.getActiveConfig();
        }
        
        // 直接从配置中获取值
        if (this.config && 
            this.config.services && 
            this.config.services[service] && 
            this.config.services[service].configs && 
            this.config.services[service].configs[configName] && 
            typeof this.config.services[service].configs[configName].max_concurrent_requests === 'number') {
            return this.config.services[service].configs[configName].max_concurrent_requests;
        }
        
        // 使用getServiceConfig方法是为了保险，确保有默认值处理
        const config = this.getServiceConfig(service, configName);
        return config ? config.max_concurrent_requests || 3 : 3;
    },

    // 设置服务的并发请求数
    setServiceConcurrentRequests: function(service, configName, value) {
        const numValue = parseInt(value, 10);
        if (isNaN(numValue) || numValue < 1 || numValue > 10) {
            console.error('并发请求数必须在1-10之间');
            return false;
        }

        return this.updateServiceConfig(service, configName, {
            max_concurrent_requests: numValue
        });
    }
};

// 暴露给全局使用
window.TranslationConfigManager = TranslationConfigManager;