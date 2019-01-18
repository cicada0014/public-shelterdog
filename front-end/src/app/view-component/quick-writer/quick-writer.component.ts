


import { Component, OnInit, HostBinding, HostListener, Input, Output, EventEmitter } from '@angular/core';
import getPlaceholderModule from 'quill-placeholder-module'
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType } from '@angular/common/http';
import { isNull } from 'util';
import { select, NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { DeviceAttribute } from 'src/app/redux/device/device.action';
import { showLoginModal } from 'src/app/redux/event/event.action';
import { AppState } from 'src/app/redux/root.reducer';
declare var Quill: any

Quill.register('modules/placeholder', getPlaceholderModule(Quill, {
    className: 'ql-placeholder-content'  // default
}));

@Component({
    selector: 'quick-writer-component',
    templateUrl: 'quick-writer.component.html',
    styleUrls: ['quick-writer.component.scss']
})

export class QuickWriterComponent implements OnInit {

    quillEditor
    content = '';
    isMobile: boolean = false;


    quickeditor = document.querySelector('#quick-editor>.ql-editor');

    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;
    @Input('placeholderCore') placeholderCore;
    @Input('refuge_id') refuge_id;
    @Input('maxWidth') maxWidth: string = '100%';

    @Input('isSimple') isSimple: boolean;
    @Input('target') target: string;

    isAnonymous: boolean = false;
    isUploading: boolean = false;
    isActive: boolean = false;

    @Output() uploadCompleate = new EventEmitter();


    // placeholder = `<p><span class="ql-size-huge" style="color: rgb(187, 187, 187);">${this.placeHolderText}</span></p>`;

    isFocus: boolean = false;
    myfiles = [];


    uploadProgress: number = 0


    articleHeaders

    title;


    selectedHeader = { label: '일반', value: null };

    isInit: boolean = false;

    constructor(
        private ngRedux: NgRedux<AppState>,
        private http: HttpClient


    ) {
        this.articleHeaders = [
            { label: '일반', value: null },
            { label: '고민', value: 1 },
            { label: '유머', value: 2 },
            { label: '정보', value: 3 },
        ];


        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
        })
    }




    selectHeader(header) {
        this.selectedHeader = header;
    }

    initEditor() {
        var toolbarOptions = [
            ['bold',
                'italic',
                'underline',
                'strike'],        // toggled buttons
            [
                'blockquote',
                // 'code-block'
            ],

            // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [
                // { 'list': 'ordered' },
                { 'list': 'bullet' }
            ],
            // [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            // [{ 'direction': 'rtl' }],                         // text direction
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            // [{ 'font': [] }],
            // [{ 'align': [] }],
            // ['link'],
            // ['clean']                                         // remove formatting button
        ];

        this.quillEditor = new Quill('#quick-editor', {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions,
                // imageResize: true,
                placeholder: {
                    delimiters: ['{', '}'],  // default
                    placeholders: [
                        { id: 'foo', label: 'Foo' },
                        { id: 'required', label: 'Required', required: true }
                    ]
                }
            },
            placeholder: `${this.placeholderCore}`,
            clipboard: {
                matchVisual: false // https://quilljs.com/docs/modules/clipboard/#matchvisual
            }
        });
        // const contents = this.quillEditor.clipboard.convert(this.content);
        // console.log(constants)
        // try {
        //     this.quillEditor.setContents(JSON.parse(this.content));
        // } catch (e) {

        // }
        if (window.localStorage.getItem('quick-writer-title')) {
            this.title = window.localStorage.getItem('quick-writer-title')
        }
        if (window.localStorage.getItem('quick-writer-content')) {
            this.quillEditor.clipboard.dangerouslyPasteHTML(0, window.localStorage.getItem('quick-writer-content'));
        }
        if (this.target == 'haewooso') {
            if (window.localStorage.getItem('quick-writer-haewooso')) {
                this.quillEditor.clipboard.dangerouslyPasteHTML(0, window.localStorage.getItem('quick-writer-haewooso'));
            }

        }

        setTimeout(() => {
            document.querySelector('.ql-editor').addEventListener('focus', () => {
                this.isActive = true;
            })
            // document.querySelector('.ql-editor').addEventListener('focusout', () => {
            //     this.isActive = false;
            // })
        }, 0);


    }

    ngAfterViewInit() {


        this.initEditor();
    }





    myUploader($event) {
        this.uploadProgress = 0;
        const formData = new FormData();
        $event.files.forEach(file => {
            formData.append('file', file);
        })
        const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });


        this.http.request(new HttpRequest(
            'POST',
            'upload/image',
            formData,
            {
                reportProgress: true
            })).subscribe(event => {
                if (event.type === HttpEventType.DownloadProgress) {
                    console.log(event)
                    // {
                    // loaded:11, // Number of bytes uploaded or downloaded.
                    // total :11 // Total number of bytes to upload or download
                    // }
                }

                if (event.type === HttpEventType.UploadProgress) {
                    this.uploadProgress = Math.floor((event.loaded / event.total) * 100);
                    if (this.uploadProgress >= 100) {
                        setTimeout(() => {
                            this.uploadProgress = 0;
                        }, 1000);
                    }
                    // {
                    // loaded:11, // Number of bytes uploaded or downloaded.
                    // total :11 // Total number of bytes to upload or download
                    // }
                }

                if (event.type === HttpEventType.Response) {
                    let imageUrls: string[] = event.body as any;
                    // imageUrls.map(url => `<div class="img-wrapper"> <img   src="${url}"/> </div> `).forEach(imgTag => this.content = this.content + imgTag);
                    const selection = this.quillEditor.getSelection()
                    this.quillEditor.clipboard.dangerouslyPasteHTML(selection ? selection.index : 0, imageUrls.map(url => `<img src="${url}" alt="${this.title}"  />`).reduce((p, c) => p + c));
                    this.myfiles.length = 0;
                }

            }
                ,
                (e) => {
                    alert('파일 업로드 실패')
                    console.log(e)
                }
            )




        // this.http
        //     .post('upload/image', formData, { headers: headers, reportProgress: true })
        //     .toPromise()
        //     .then(r => {
        //         console.log(r);
        //         let imageUrls: string[] = r as any;

        //         // imageUrls.map(url => `<div class="img-wrapper"> <img   src="${url}"/> </div> `).forEach(imgTag => this.content = this.content + imgTag);
        //         const selection = this.quillEditor.getSelection()
        //         this.quillEditor.clipboard.dangerouslyPasteHTML(selection ? selection.index : 0, imageUrls.map(url => `<img src="${url}"/>`).reduce((p, c) => p + c));
        //         this.myfiles.length = 0;

        //     })
        //     .catch(e => {
        //         // this.messageService.add({ key: 'editor-toast', severity: 'error', summary: '에러', detail: '파일 업로드에 실패하였습니다.' })
        //         console.log(e)
        //     })
    }


    checkBlank() {
        let target = document.querySelector('#quick-editor>.ql-editor');
        if (target) {
            let _content = target.innerHTML;
            return !(_content == '<p><br></p>' || _content == '<p></p>' || _content == '<p> </p>')
        }

    }


    save() {
        this.isUploading = true;

        let content = document.querySelector('#quick-editor>.ql-editor').innerHTML;
        const imgRegexp = /<img src\s*=\s*\\*"(.+?)\\*"\s*(\/)?>/g;
        let imgs;

        // while (!isNull(imgs = imgRegexp.exec(content))) {
        //     if (imgs && imgs.length > 0) {
        //         for (let img of imgs) {
        //             let srcs = /src\=\"[^\s]*\"/.exec(img)
        //             if (srcs) {
        //                 if (srcs[0].substring(5, srcs[0].length - 1).substring(0, 5) !== 'https') {
        //                     this.isUploading = false;
        //                     alert('보안되지 않은 사이트의 이미지는 넣을 수 없습니다. 이미지 경로가 https://로 시작해야합니다.')
        //                     // this.messageService.add({ key: 'editor-toast', severity: 'warn', summary: '이미지', detail: '보안되지 않은 사이트의 이미지는 넣을 수 없습니다. 이미지 경로가 https://로 시작해야합니다.' })
        //                     return
        //                 }
        //             }
        //         }
        //         // let imgSrc = imgs[1].replace(/width\=\"\d+\"/, '');
        //         // console.log(imgSrc.replace(/style\=\".*\"/, ''))
        //     }
        // }

        if (!this.isSimple) {
            if (!this.title) {
                alert('제목을 입력하세요.')
                this.isUploading = false;
                // this.messageService.add({ key: 'editor-toast', severity: 'warn', summary: '제목', detail: '글 제목을 입력하세요.' })
                return
            }
        }


        // let targetUrl = `${this.randomUser ? 'admin/' : ''}article`


        let _content = document.querySelector('#quick-editor>.ql-editor').innerHTML;
        if (!this.target) {
            this.http
                .post('article', {
                    title: this.title,
                    content: _content,
                    refuge_id: this.refuge_id,
                    header_id: typeof this.selectedHeader == 'number' ? this.selectedHeader : this.selectedHeader.value,
                    anonymous: this.isAnonymous
                })
                .toPromise()
                .then((r: any) => {

                    // this.messageService.add({ key: 'editor-toast', severity: 'success', summary: '성공', detail: '성공적으로 저장되었습니다.' })
                    // this.router.navigateByUrl(`refuge-article/${r.id}`)
                    window.localStorage.removeItem('quick-writer-title')
                    window.localStorage.removeItem('quick-writer-content')
                    this.quillEditor.setText('');
                    this.title = '';
                    this.uploadCompleate.emit('');
                    this.isUploading = false;
                    this.isActive = false;
                    setTimeout(() => {
                        alert('성공적으로 게시되었습니다.')
                    }, 0);
                })
                .catch((e) => {
                    console.log(e)
                    this.isActive = false;
                    this.isUploading = false;
                    window.localStorage.setItem('quick-writer-title', this.title)
                    window.localStorage.setItem('quick-writer-content', _content)

                    if (e.status == 401) {
                        this.ngRedux.dispatch(showLoginModal(true))

                    } else if (e.status == 400) {
                        if (e.error.message == 'banned user') {
                            alert('차단된 사용자입니다.')
                        }
                        else if (e.error.message == 'Available in 1 minute') {
                            alert('글 작성 뒤 바로 작성 할 수 없습니다. 1분 마다 가능합니다.')
                        }
                        else {
                            alert('권한이 없습니다.')
                        }

                    }
                })
        } else if (this.target == 'haewooso') {

            if (!_content || _content == '<p><br></p>' || _content == '<p></p>' || _content == '<p> </p>') {
                alert('내용을 넣어주세요.')
                this.isUploading = false;
                // this.isActive = false;
                return
            };
            if (_content.length > 2000) {
                alert('2000자 이내로 적어주세요!')
                this.isUploading = false;
                // this.isActive = false;
                return
            }


            this.http
                .post('haewooso/article', {
                    content: _content,
                })
                .toPromise()
                .then((r: any) => {
                    window.localStorage.removeItem('quick-writer-haewooso');
                    this.quillEditor.setText('');
                    this.uploadCompleate.emit('');
                    this.isUploading = false;
                    this.isActive = false;
                    setTimeout(() => {
                        alert('😁')
                    }, 0);
                })
                .catch((e) => {
                    console.log(e)
                    this.isActive = false;
                    this.isUploading = false;
                    window.localStorage.setItem('quick-writer-haewooso', _content)

                    if (e.status == 401) {
                        this.ngRedux.dispatch(showLoginModal(true))

                    } else if (e.status == 400) {
                        if (e.error.message == 'banned user') {
                            alert('차단된 사용자입니다.')
                        }
                        else if (e.error.message == 'Available in 1 minute') {
                            alert('글 작성 뒤 바로 작성 할 수 없습니다. 1분 마다 가능합니다.')
                        }
                        else {
                            alert('권한이 없습니다.')
                        }

                    }
                })
        }

    }




    ngOnInit() {


    }
}