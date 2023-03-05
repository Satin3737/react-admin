import $ from 'jquery';

$.get('./files/api', data => {
    data.forEach(file => {
       $('body').append(`<h1>${file}</h1>`);
    });
}, 'JSON');