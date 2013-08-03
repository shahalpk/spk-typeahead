angular.module('spk-directives',[])
.directive('spkTypeahead',function($parse){
  return {
    restrict:'A',
    link: function(scope,element,attrs,controller){
        var getter = $parse(attrs.spkTypeahead),
            setter = getter.assign,
            srcObj = getter(scope),
            model = attrs.targetModel,   //targetModel is the model where the value of the selection is to be saved.
            srcObjSetFlag = false;
            
        

        var tModelSetter = $parse(attrs.targetModel).assign;
        var eModelGetter = $parse(attrs.ngModel);     

        scope.$watch(attrs.spkTypeahead, function(newValue, oldValue) {          
          if(newValue !== oldValue) {            
            srcObj = newValue;            
          }
        });
        // Here value is an object of key value pairs

        element.attr('data-provide', 'typeahead');
        element.typeahead({
          // source: function(query) { return angular.isFunction(value) ? value.apply(null, arguments) : value; },
          source: function(query) { 
            return Object.keys(srcObj);
          },
          minLength: attrs.minLength || 1,
          items: attrs.items,
          updater: function(value) {
            // If we have a controller (i.e. ngModelController) then wire it up
            if(controller) {
              scope.$apply(function () {
                controller.$setViewValue(value);
              });
            }
            tModelSetter(scope,srcObj[value]);      
            scope.$apply();      
            scope.$emit('typeahead-updated', value);
            return value;
          }
        });
        //Now add a watch for the model represented by current object.
        scope.$watch(attrs.ngModel,function(newValue){
          if (newValue==""){
            tModelSetter(scope,null);
          }
        })
    }
  }

})