# 实时翻译系统

这是一个基于Web的实时语音转写、翻译和TTS系统的演示项目。

## 功能特点

- 实时语音识别 (ASR)
- 多语言翻译支持
- 文本转语音 (TTS)
- 支持多种翻译服务 (Google, DeepLX等)
- 灵活的配置管理

## 并发请求设置

系统支持自定义并发翻译请求数量，可以根据网络状况和服务器负载进行调整：

- 1 = 串行处理（稳定但较慢）
- 3 = 推荐值（平衡性能和稳定性）
- 6 = 高性能模式（需要良好网络）
- 8-10 = 极限模式（仅适用于快速网络）

配置保存在 `config/translation_config.json` 文件中，可通过Web界面的设置面板进行修改。

## 贡献

欢迎提交Pull Request或Issues。