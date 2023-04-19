import axios from "axios";
import Helper from "../helpers/helper.js";

export default class EditorImages {
    constructor(element, virtualElement, ...[isLoading, isLoaded]) {
        this.elment = element;
        this.virturalElement = virtualElement;
        this.isLoading = isLoading;
        this.isLoaded = isLoaded;
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
                this.isLoading();
                axios
                    .post(this.route.apiRoute + 'uploadImage.php', formData, {
                        headers: {
                            'Content-type': 'multipart/form-data'
                        }
                    })
                    .then((res) => {
                        this.virturalElement.src = this.elment.src = `./img/${res.data.src}`;
                        Helper.showNotifications('Image uploaded', 'success');
                    })
                    .catch(() => Helper.showNotifications('Uploading error', 'danger'))
                    .finally(() => {
                        this.imgUploader.value = '';
                        this.isLoaded();
                    });
            }
        });
    }
}