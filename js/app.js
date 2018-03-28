//本地存储
var store={
   save:function(todos){
   localStorage.setItem("gg",JSON.stringify(todos));
},
   fetch:function(){
   return JSON.parse(localStorage.getItem("gg")) || [];
}
}


//自定义一个过滤器
var filterbbb={
    all:function(alltodos){
    return alltodos;
   },
   active:function(alltodos){
   return alltodos.filter(function(item){
   return !item.complated;
    });
   },
   completed:function(alltodos){
   return alltodos.filter(function(item){
   return item.complated;
   });
   }
}
//获取#id hash
function getHash(){
   var str= location.hash
   var re=/#\//;
   
   str = str.replace(re,"") || "all"
   
   return str;

}

new Vue({
   el:"#app",
   data:{
      todoText:"",
      todos:store.fetch(), // 取出数据
      editingFlag:null,
      editingText:"",
      key:0,
      cur:getHash(),
},

//自定义指令
directives:{
   'bb-focus':function(ele,val){
      if (val) {
      ele.focus()
       }
    }
},
watch:{
      todos: {
           handler: function (val, oldVal) {
           // 只要todos有变化 就存到本地
          store.save(val)
},
   deep: true //深度 监控 能监控到对象里面的属性
}
},
computed:{
	// 只要属性 有变化我们就执行
    backTodos:function(){
    return filterbbb[this.cur](this.todos)

}

},
//自动执行
created:function(){

},
methods:{
	
   Submit(){
       if (!this.todoText || !this.todoText.trim()) return; //判断输入框的内容（在for列表）
       this.todos.unshift({  //插入
          content:this.todoText,  //todoText双向绑定的内容
          complated:false
          
        })
        this.todoText="";  //清空
    },
    //双击内容框状态
    editing(item){
     this.editingFlag=item;   //初始化一个数组并把li列表的内容传过去
    
    this.editingText = item.content;  //双击后li列表的内容赋值给初始化的数组
    },
    //双击内容框后回车
    editingEnter(item,index){
    	if(!this.todoText.trim()){  //判断是否为空和删除空格
    		//删除LI
    		this.todos.splice(index,1);  //  删除
    		return;
    	}
    	//删除class
    	this.editingFlag=null;   
    	item.content=this.editingText;   
    },
    //双击内容框后回车退出
    editingEsc(){
    	this.editingFlag=null;
    },
    //单击
    toggleCompleted(item){
    	item.complated = !item.complated
    },
    //全选
    toggleAll(){
        this.key++;
        this.todos.forEach((item,index)=>{
        	if(this.key % 2 == 1){
                item.complated = true;
        }
        else{
        	item.complated = false;
        }
        })  
    },
    //删除
    removeTodos(item,index){
    	let off=confirm("确定要删除？")
    	if(!off) return;
    	this.todos.splice(index,1);  //  删除
    }
  }
})

