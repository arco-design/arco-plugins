## 1.4.8

`2023-02-08`

🐛 BugFix

- Fix babel custom configuration issues


## 1.4.4

`2022-10-19`

🐛 BugFix

- Fix `!` recognition issue in style loading


## 1.4.2

`2022-09-28`

💎 Enhancement

- Optimization When the user already has babel-loader, modify the babel configuration directly instead of introducing a new loader

🐛 BugFix

- Fixed the bug that the user-defined babel plugin could not get the source code path due to the introduction of the plugin


## 1.4.1

`2022-06-22`


💎 Enhancement

- Built-in adaptation to pnpm's path format
  
## 1.4.0

`2022-06-22`


💎 Enhancement

- `include` and `varsInjectScope` supports regular expressions.

## 1.3.1

`2022-03-18`


🐛 BugFix

- Import theme fails when using pnpm.
  
## 1.3.0

`2022-03-17`

### 🆕 Feature

- Replace property  `themeOption` with `varsInjectScope`

## 1.2.0

`2022-03-17`

### 🆕 Feature

- Add property `themeOption`
  
## 1.1.2

`2022-02-21`


🐛 BugFix

- `transform-loader` should be load after `ts-loader`

## 1.1.1

`2022-02-15`


🐛 BugFix

- Fix the problem of getCompilationHooks is undefined
- 
## 1.1.0

`2022-02-14`

### 🆕 Feature

- Support specifying webpack implementation by `webpackImplementation`

🐛 BugFix

- Fix the problem of cannot find @babel/preset-typescript
