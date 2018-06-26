'use strict';

(function () {

  var createErrorMessage = function (textMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'fixed';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.style.lineHeight = '60px';
    node.style.color = 'white';

    node.textContent = textMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };


  window.errorMessage = {
    create: createErrorMessage
  };

})();
