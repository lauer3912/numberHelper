/**
 * Created by Eva on 2016/11/15.
 */
	//$(function(){})   //用于存放操作DOM对象的代码，执行其中代码时DOM对象已存在。
//不可用于存放开发插件的代码，因为jQuery对象没有得到传递，外部通过jQuery.method也调用不了其中的方法（函数）。
$(function(){
	
	var numTChar,numTMoney;
	//获取历史记录
	var historyRecord = window.localStorage.localHistory ? JSON.parse(window.localStorage.localHistory):[];
	var historyRecordItem;
	//console.log(historyRecord);
	//简体中文 大写数字	 大写金额
	function showCNY(num){
		
		numTChar= Nzh.cn.encodeB(num);
		numTMoney= Nzh.cn.toMoney(num);
		$("#numToChar").text(numTChar);
		$("#numToMoney").text(numTMoney);
		historyRecordItem={
			conversionMode:"CNY",
			num:num,
			numToChar:numTChar,
			numToMoney:numTMoney
		};
		historyRecord.push(historyRecordItem);//存储转换记录
	}
	//繁体中文 繁体数字 繁体金额
	function showHKY(num){
		numTChar =  Nzh.hk.encodeB(num);
		numTMoney = Nzh.hk.toMoney(num);
		// console.log(numTChar);
		// console.log(numTMoney);
		$("#numToChar").text(numTChar);
		$("#numToMoney").text(numTMoney.replace('$','人民币'));
		historyRecordItem={
			conversionMode:"HKY",
			num:num,
			numToChar:numTChar,
			numToMoney:numTMoney.replace('$','人民币')
		};
		historyRecord.push(historyRecordItem);//存储转换记录
	}
	
	//日文数字  日文金额
	function showJPY(num){
		numTChar = Nzh.jp.encodeS(num);
		numTMoney = Nzh.jp.formatJPNum(num);
		$("#numToChar").text(numTChar);
		$("#numToMoney").text(numTMoney);
		historyRecordItem={
			conversionMode:"JPY",
			num:num,
			numToChar:numTChar,
			numToMoney:numTMoney
		};
		historyRecord.push(historyRecordItem);//存储转换记录
	}
	//执行转换的函数
	function submit() {
			var num = $("#number").val();
			switch ($(".money-subtitle").text()){
				case "CNY":
					showCNY(num);
					break;
				case "HKY":
					showHKY(num);
					break;
				case "JPY":
					showJPY(num);
					break;
				default:
					break;
			}
			customOutput();
			window.localStorage.localHistory = JSON.stringify(historyRecord);//将转换记录存到缓存中
	}
	//表单验证
	$.validator.addMethod( "numeric", function( value, element ) {
		var regs = /(^([+-])?0*(\d+)(\.(\d+))?$)|(^([+-])?0*(\d+)(\.(\d+))?e(([+-])?(\d+))$)|(^1\d$)/;
		return this.optional( element ) || regs.test( value );
	}, "Please enter a numeric value, and the scientific notation is allowed" );
	
	$("#oNumber").validate({
		errorElement:'span',
		errorClass:'err-message',
		focusInvalid: false,
		rules:{
			number:{
				required:true,
				numeric:true
			}
		},
		messages: {
			number: {
				required: 'Value cannot be empty',
				numeric:"Value must be digital or  the scientific numbers"
			}
		},
		submitHandler:function(form){
			submit();
		}
	});
	//点击币种切换菜单执行转行 同时根据自定义规则输出自定义结果
		$(".menu_list").click(function(){
			var conversionHistory = $(".conversion_history");
			if(conversionHistory.css("display") === "block") {
				$(".right_main").css("display", "block");
				conversionHistory.css("display", "none");
			}
			if($("#number").val().length>0){
				submit();
				customOutput();
			}
		});
	
	
	//自定义输出
	var count;
	function customOutput(){
		var reg,index,customTar,customChar;
		var customInput = $(".custom_input_l").slice(1);
		var customResult = $(".custom_input_r").slice(1);
		count = 0;
		customInput.each(function(){
			var $this = $(this);
			if($this.val().length > 0) {
				index = $this.val().indexOf("=");
				customChar = $this.val().substring(1, index);//被替换字符
				customTar = $this.val().substring(index + 1, $this.val().length - 1);//替换字符
				reg = new RegExp(customChar, 'g');//.replace()方法默认只替换第一次出现的字符，忽略后面相同的字符，将被替换内容定义为正则表达式，可以全部替换
				$this.parent().find(".custom_input_r").val($("#numToChar").text().replace(reg, customTar));
			}
		});
		customResult.each(function(){
			if($(this).val().length>0){
				count++;
			}
		});
		//表单下方自定义条目
		$(".custom_info span").text(count);
	}
	//点击每行的 ✔️ 执行自定义输出
	$(".fa-check").click(function(){
		var oResult;
		var reg,index,customTar,customChar;
		var parent = $(this).parent().parent();
		var customInput = parent.find(".custom_input_l");
		var customResult = parent.find(".custom_input_r");
		count=0;
		if(customInput.val().length > 0){
			index = customInput.val().indexOf("=");
			customChar = customInput.val().substring(1,index);//被替换字符
			customTar = customInput.val().substring(index+1,customInput.val().length-1);//替换字符
			reg = new RegExp(customChar,'g');//.replace()方法默认只替换第一次出现的字符，忽略后面相同的字符，将被替换内容定义为正则表达式，可以全部替换
			customResult.val($("#numToChar").text().replace(reg,customTar));
			//替换成功后样式调整
			$(this).parent().css("visibility","hidden");
			customInput.css({background:'transparent',border:"none"});
			parent.find(".custom_input").css('margin-top','3px');
			customResult.css({'height':'24px','line-height':'24px'});
			parent.find(".tooltips").remove();
		}
		//表单下方自定义条目
		//计数器++
		oResult = $(".custom_input_r").slice(1);
		oResult.each(function(){
			if($(this).val().length>0){
				count++;
			}
		});
		$(".custom_info span").text(count);
	});
	//取消或删除自定义
	$(".fa-times").click(function(){
		//var oResult;
		var parent = $(this).parent().parent();
		var customInput = parent.find(".custom_input_l");
		var customResult = parent.find(".custom_input_r");
		//oResult = $(".custom_input_r").slice(1);
		//oResult.each(function(){
			if(customResult.val().length>0){
				count--;
			}
		//});
		$(this).parent().css("visibility","hidden");
		customInput.val("").css({background:'transparent',border:"none"});
		parent.find(".custom_input").css('margin-top','3px');
		customResult.val("").css({'height':'24px','line-height':'24px'});
		parent.find(".tooltips").remove();
		$(".custom_info span").text(count);
	});
	
	//查看历史记录
	
	$(".history").click(function(){
		var tableDom ;
		var tableContent="<tr><th class='index'>Serial</th><th class='mode'>Mode</th><th class='_num'>Number</th><th class='convResult'>NumToChar</th><th class='convResult'>NumToMoney</th></tr>";
		var information="";
		var conversionHistory = $(".conversion_history");
		var historyInfo = $(".history_info");
		if(conversionHistory.css("display") === "none"){
			$(".right_main").css("display","none");
			conversionHistory.css("display","block");
			//historyRecord = window.localStorage.localHistory ? JSON.parse(window.localStorage.localHistory):[];
			//console.log("historyRecord2:"+Array.isArray(historyRecord));
			//console.log("historyRecordLength2:"+historyRecord.length);
			if (historyRecord.length > 0) {
				$.each(historyRecord, function (index, item) {
					tableContent += "<tr><td class='index'>" + (index + 1) + "</td><td class='mode'>" + item.conversionMode + "</td><td class='_num'>" + item.num + "</td><td class='convResult'>" + item.numToChar + "</td><td class='convResult'>" + item.numToMoney + "</td></tr>";
				});
				tableDom = "<table class='table'>"+tableContent+"</table>";
				//console.log(tableDom);
				historyInfo.html(tableDom);
			} else {
				information = "<p class='info'>There is no conversion record yet.</p>";
				historyInfo.html(information);
			}
		}else{
			$(".right_main").css("display","block");
			conversionHistory.css("display","none");
		}
	});
});