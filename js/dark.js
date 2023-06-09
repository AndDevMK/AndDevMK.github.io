//通过时间判断夜间模式，否则会完全手动切换并本地持久化模式，下次自动渲染本地持久化的模式
var darkMode = {
    config:{    
      startHour:19,//19点开始
      endHour:7,//7点结束    
    },
    _darkTheme:null,  //dark.css标签
    _modeToggle:null, //手动切换按钮块
    _mobileModeToggle:null, //手动切换按钮块
    _currentHour:0, //当前小时
    _storageKey:"dark-mode-storage",
    _storageByHandLastTIme:0, //上次手动设置模式时间 毫秒
    _storageOverdueHours:12,  //每隔12小时重新检查本地持久化
  
    init:function(){
      //夜间模式切换配置
      this._darkTheme = document.getElementById("dark-mode-theme");  
      this._modeToggle = document.getElementById("dark_mode_toggle");    
      this._mobileModeToggle = document.getElementById("mobile_dark_mode_toggle");   
      this._currentHour = new Date().getHours();  
  
      this.toggleListen();
      this.initMode();
    },
    initMode:function(){
      //初始化模式，来源本地持久化或自动检测模式    
      let initMode = this.getModeFromStorage() || this.autoMode(); 
      this.setMode(initMode);
    },
    toggleListen:function(){
      let _this = this;
      //手动切换触发模式更改
      this._modeToggle.addEventListener("click", () => {
          if (this._modeToggle.className === "dark_mode") {
              _this.setModeByHand("dark");
          } else if (this._modeToggle.className === "light_mode") {
              _this.setModeByHand("light");
          }
      });

      this._mobileModeToggle.addEventListener("click", () => {
        if (this._mobileModeToggle.className === "mobile_dark_mode") {
            _this.setModeByHand("dark");
        } else if (this._mobileModeToggle.className === "mobile_light_mode") {
            _this.setModeByHand("light");
        }
     });
  
    },  
    // 根据时间自动获取模式
    autoMode:function(){
      let _currentHour = this._currentHour;
      if(_currentHour > this.config.startHour || _currentHour < this.config.endHour){
        return "dark";  
      }  
      return "light";    
    },
    // 真正切换mode的地方
    setMode:function(mode){
      if (mode === "dark") {
          this._darkTheme.disabled = false;
          this._modeToggle.className = "light_mode";
          this._mobileModeToggle.className = "mobile_light_mode";
      } else if (mode === "light") {
          this._darkTheme.disabled = true;
          this._modeToggle.className = "dark_mode";
          this._mobileModeToggle.className = "mobile_dark_mode";
      }          
    },
    // 手动设置mode
    setModeByHand:function(mode){
      if (Even.slideout) {
        Even.slideout.close();
      }
      this.setMode(mode);
      this.setModeToStorage(mode);    
    },
    setModeToStorage:function(mode){
      localStorage.setItem(this._storageKey, mode);
      localStorage.setItem(this._storageKey+"-last-time", (new Date().getTime()));     
    },
    getModeFromStorage:function(){
      let _mode = localStorage.getItem(this._storageKey);
      let _lastSetTime = localStorage.getItem(this._storageKey+"-last-time");
      if(_mode && _lastSetTime){
        _lastSetTime = _lastSetTime/1000;
        let _currentTime = new Date().getTime()/1000;
        let _overdueSeconds = this._storageOverdueHours * 3600;
        if(_currentTime - _lastSetTime < _overdueSeconds){            
          return _mode;
        }
      }
      localStorage.removeItem(this._storageKey);
      localStorage.removeItem(this._storageKey+"-last-time");
      return false;
  
    },
  
  
  };
  
  darkMode.init();