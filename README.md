### used

#### 模块化
    import FrontRequestTool from 'FrontRequestTool'
    new FrontRequestTool('1aa8174f4db48dacac286d1f643a7e06', 'e3d90b3330ceb634c75f74aad0a38968')

#### 非模块化（参考example)

### pacakage:
    npm i -D babel-loader @babel/core @babel/preset-env webpack
    npm i -D extract-text-webpack-plugin
    npm i -D style-loader
    npm i -D css-loader
    npm i -D sass-loader
    npm i -D node-sass
    npm i -D webpack-dev-server
    npm i -save hydrogen-js-sdk // 放在dependencies，让webpack递归安装包内依赖的包