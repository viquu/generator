 $('#birthday').datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        language: 'zh-CN',
        todayBtn:  true,
         minView: 'month'

      });
    
      // 随机生日
      function getRandomDate(startYear, endYear) {
        function padToTwoDigits(num) {
            return num.toString().padStart(2, '0');
        }
    
        var startDate = new Date(startYear, 0, 1); // January 1st of startYear
        var endDate = new Date(endYear, 11, 31); // December 31st of endYear
    
        var randomTimestamp = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
        var randomDate = new Date(randomTimestamp);
    
        var year = randomDate.getFullYear();
        var month = padToTwoDigits(randomDate.getMonth() + 1); // getMonth() returns 0-11
        var day = padToTwoDigits(randomDate.getDate());
    
        return `${year}-${month}-${day}`;
      }

      // 随机性别
      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    
      // 随机身份证
      function randomGenId() {
        var $province = $('#province');
        var $city = $('#city');
        var $county = $('#county');
        $.getJSON('area.json',function(data){
          area = data;
          // Get a random county key with its province and city keys
          var randomKeys = getRandomCountyKey(data);
          console.log(randomKeys); // Example output: { provinceKey: '450000', cityKey: '450800', countyKey: '450802' }
          $province.val(randomKeys.provinceKey).change(); // 触发change事件，更新城市选项

          // 使用延迟确保省市级联完成后，再选城市和区县
          setTimeout(function() {
              $city.val(randomKeys.cityKey).change(); // 触发change事件，更新区县选项

              setTimeout(function() {
                  $county.val(randomKeys.countyKey).change(); // 触发change事件
                  generateId();
              }, 50); // 50毫秒延迟，根据实际情况调整
          }, 50); // 50毫秒延迟，根据实际情况调整
          
          var randomDate = getRandomDate(1960, 2000);
          console.log(randomDate); // Example output: "1983-07-24"
          $('#birthday').val(randomDate);

          var randomValue = getRandomInt(1, 2); // Generates a random number between 1 and 2
          $('input[name="sex"][value="' + randomValue + '"]').prop('checked', true);
          
        });
        
      }

      /**生成身份证号**/
      function generateId(){
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = 1000;
       
        var province =$('#province').val();
        var city =$('#city').val();
        var county =$('#county').val();
        var birthday = $('#birthday').val();
        var sex= $('input[name="sex"]:checked').val();
        var flag =true;
        if(province =='-1'){
          toastr.warning('请选择省份!');
          flag =false;
        }
        if(city =='-1'){
          toastr.warning('请选择城市!');
          flag =false;
        }
        if(county =='-1'){
          toastr.warning('请选择区县!');
          flag =false;
        }
        if(birthday ==''){
          toastr.warning('请选择时间!');
          flag =false;
        }
       if(sex ==undefined || sex ==''){
          toastr.warning('请选择性别!');
          flag =false;
        }
        if(!flag){
            return;
        }   
        var IDcard;
        var bd =birthday.replace(/\-/g,"");  
        var Rand = Math.floor(100+Math.random()*(999-100));
        if(sex =='1'){
          if(Rand%2==0){
            Rand+=1;
          }
        }else if(sex =='2'){
         if(Rand%2!=0){
            Rand+=1;
          }
        }
        IDcard = county+bd+Rand;
        var verify = getVerifyCode(IDcard);
        IDcard = IDcard+verify;
        $('#IDCard').val(IDcard);
      }

      /**
        获得身份证校验位
      **/
      var getVerifyCode=function(IDcard){
        var ValCodeArr = ["1", "0", "X", "9", "8", "7", "6", "5", "4","3","2"];
        var Wi = ["7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7","9", "10", "5", "8", "4", "2"];
        var tmp=0;
        for (var i =0; i <Wi.length; i++) {
              tmp +=IDcard.charAt(i)*Wi[i];
        }
        var modValue = tmp % 11;
        var strVerifyCode = ValCodeArr[modValue];
        return strVerifyCode;
      }

    /**
     * 检查输入的身份证号格式是否正确 
     * 输入:
     * str 字符串 
     */
    function checkCard() {
      toastr.options.positionClass = 'toast-center-center';
      toastr.options.timeOut = 1000;

      var str = $('#IDCard').val();
      if(str ==''){
        toastr.warning('请生成身份证号码!');
        return;
      }
      // 15位数身份证正则表达式
      var arg1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
      // 18位数身份证正则表达式
      var arg2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[xX])$/;
      if (str.match(arg1) == null && str.match(arg2) == null) {
          toastr.warning('证件号码格式错误!');
        return;
      } else{
         toastr.info('正确格式身份证号码');
      }
   }