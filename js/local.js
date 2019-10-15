// local.js
'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileInput = document.querySelector('#upload-file');

  fileInput.addEventListener('change', function () {
    var file = fileInput.files[0];
    if (file) {
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });
      if (matches) {
        var reader = new FileReader();
        var preview = document.querySelector('.img-upload__preview');

        reader.addEventListener('load', function () {
          preview.firstElementChild.src = reader.result;
        });
        reader.addEventListener('error', function () {
          window.onError(reader.error.message);
        });

        reader.readAsDataURL(file);
      }
    }
  });
})();
