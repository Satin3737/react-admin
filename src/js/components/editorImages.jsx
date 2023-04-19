import axios from "axios";

export default class EditorImages {
    constructor(element, virtualElement) {
        this.elment = element;
        this.virturalElement = virtualElement;
        this.elment.addEventListener('click', () => this.onClick());
        this.imgUploader = document.querySelector('#img-upload');
        this.route = {
            projectRoute: './project/',
            apiRoute: './api/'
        }
    }
    
    onClick = () => {
        this.imgUploader.click();
        this.imgUploader.addEventListener('change', () => {
            if (this.imgUploader.files && this.imgUploader.files[0]) {
                let formData = new FormData();
                formData.append('image', this.imgUploader.files[0]);
                axios
                    .post(this.route.apiRoute + 'uploadImage.php', formData, {
                        headers: {
                            'Content-type': 'multipart/form-data'
                        }
                    })
                    .then((res) => {
                        console.log(res)
                        this.virturalElement.src = this.elment.src = `./img/${res.data.src}`;
                        this.imgUploader.value = '';
                    });
                    
            }
        });
    }
}