import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { DefenceStageScene } from './defence.stage.scene';
import { waveTotal } from '../wave/wave.total';
import { HttpClient } from '@angular/common/http';
import { NgRedux } from '@angular-redux/store';
import { AppState } from 'src/app/redux/root.reducer';
import { showLoginModal } from 'src/app/redux/event/event.action';
import * as moment from 'moment';
import { Turret } from '../objects/turret';
import { GameTimeService } from '../../../lib/time.service';

@Injectable()
export class DefenceSettingScene extends Phaser.Scene {




    fromStage: boolean = false;

    enterKey: Phaser.Input.Keyboard.Key;
    that: any;

    indexText: Phaser.GameObjects.Text;



    selectedSlotData;

    saveSlot1: Phaser.GameObjects.Image
    saveSlot1Text: Phaser.GameObjects.Text
    saveSlot2: Phaser.GameObjects.Image
    saveSlot2Text: Phaser.GameObjects.Text

    saveBtn: Phaser.GameObjects.Image
    loadBtn: Phaser.GameObjects.Image

    constructor(private http: HttpClient,
        private ngRedux: NgRedux<AppState>

    ) {
        super({
            key: 'setting'
        })

    }
    preload() {
        // var progressBar = this.add.graphics();
        // var progressBox = this.add.graphics();
        // progressBox.fillStyle(0x222222, 0.8);
        // progressBox.fillRect(500 - 160, 275 - 25 - 5, 320, 50);
        // var width = this.cameras.main.width;
        // var height = this.cameras.main.height;
        // var loadingText = this.make.text({
        //     x: width / 2,
        //     y: height / 2 - 50,
        //     text: 'Loading...',
        //     style: {
        //         font: '20px monospace',
        //         fill: '#ffffff'
        //     }
        // });
        // loadingText.setOrigin(0.5, 0.5);
        // var percentText = this.make.text({
        //     x: width / 2,
        //     y: height / 2 - 5,
        //     text: '0%',
        //     style: {
        //         font: '18px monospace',
        //         fill: '#ffffff'
        //     }
        // });
        // percentText.setOrigin(0.5, 0.5);

        // this.load.on('progress', function (value)  {
        //     console.log(value);
        //     progressBar.clear();
        //     progressBar.fillStyle(0xffffff, 1);
        //     progressBar.fillRect(510 - 150 - 10, 285 - 15 - 10 - 5, 300 * value, 30);
        //     percentText.setText(parseInt(value) * 100 + '%');
        // });

        // // this.load.on('fileprogress', (file) => {
        // //     console.log(file.src);
        // // });
        // this.load.on('complete', function ()  {
        //     console.log('complete');
        //     progressBar.destroy();
        //     progressBox.destroy();
        //     loadingText.destroy();
        //     percentText.destroy();
        // });

        this.load.image('interface1000550', 'assets/game/defence/interface1000550.png');
        this.load.image('save-slot', 'assets/game/defence/interface350100.png')
        this.load.image('return_btn', 'assets/game/defence/return_btn.png')
        // this.load.image('return_btn', 'assets/game/defence/return_btn.png')



    }

    create() {

        this.displaySaveSlot(this.fromStage)





        if (this.fromStage) {
            this.add.image(500, 275, 'current-snapshot').setAlpha(0.35)
        }
        this.add.image(500, 275, 'interface1000550').setScale(0.7);

        this.add.text(350, 125, this.fromStage ? '저장 할 공간을 선택하세요.' : '불러 올 데이터를 선택하세요.', {
            // width: `${this.game.canvas.width - 50}px`,
            // height: `${(this.game.canvas.height / 3) - 50}px`,
            color: '#fff',
            'fontSize': '24px',
            textAlign: 'left',
            fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
            // wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
        })


        this.add.image(750, 410, 'return_btn').setInteractive({
            useHandCursor: true,
        }).on('pointerdown', () => {
            this.scene.stop('setting');
            if (this.fromStage) {
                this.scene.run('stage')
            } else {
                this.scene.run('index')
            }
        })
        // this.input.on('pointerdown', (event) => {
        //     this.scene.start('intro')
        // })

        // this.input.on('pointerdown', () => {
        //     // this.scene.setVisible(false, 'menu')
        //     // this.scene.bringToTop('stage')
        //     this.scene.stop('setting')
        //     this.scene.run('stage')
        // })

        // var rect = new Phaser.Geom.Rectangle(0, this.game.canvas.height * 2 / 3, this.game.canvas.width, this.game.canvas.height / 3);


        // this.add.image()


        // this.add.text(200, 200, '돌아가기')


        if (this.fromStage) {
            // this.saveBtn = this.add.image(
            //     200,
            //     (100),
            //     `저장
            //     `)
            // this.saveBtn.setInteractive().on('pointerdown', () => {
            //     this.displaySaveSlot(true)
            // });
        };

        // this.loadBtn = this.add.image(
        //     200,
        //     (200),
        //     `load_btn`)

        // this.loadBtn.setInteractive().on('pointerdown', () => {
        //     this.displaySaveSlot(false)
        // });







    }

    // update는 루프 문이다.
    update() {


    }


    async displaySaveSlot(save: boolean) {
        let defenceStage: DefenceStageScene = this.scene.get('stage') as any;
        if (defenceStage.isWaving) {
            alert('웨이브가 진행 중일때는 저장 할 수 없습니다. 웨이브를 마친 후 저장하세요.')
            this.scene.stop('setting');
            this.scene.run('stage');
            return
        }


        this.http
            .get('game/defence/data', { params: { game_id: '3' } })
            .toPromise()
            .then(r => {
                let result: { id, user_id, game_id, data, created_at, updated_at }[] = r as any;


                if (this.saveSlot1) {
                    this.saveSlot1.destroy()
                    this.saveSlot1 = null
                }
                if (this.saveSlot2) {
                    this.saveSlot2.destroy()
                    this.saveSlot2 = null
                }
                this.saveSlot1 = this.add.image(500, 225, 'save-slot')
                if (result[0]) {
                    this.saveSlot1Text = this.add.text(390, 220, `${moment(result[0].updated_at).format('YYYY-MM-DD HH:mm')} ${save ? '저장' : '불러오기'} `)
                    this.saveSlot1.setInteractive({
                        useHandCursor: true,
                    }).on('pointerdown', () => {
                        if (save) {
                            this.saveUserData(result[0]);
                        } else {
                            this.loadUserData(result[0])
                        }
                    })
                } else {
                    this.saveSlot1Text = this.add.text(390, 220, '저장 슬롯이 비어있습니다.')
                    if (save) {
                        this.saveSlot1.setInteractive({
                            useHandCursor: true,
                        }).on('pointerdown', () => {
                            this.saveUserData();
                        })
                    }
                }
                this.saveSlot2 = this.add.image(500, 325, 'save-slot')
                if (result[1]) {
                    this.saveSlot2Text = this.add.text(390, 320, `${moment(result[1].updated_at).format('YYYY-MM-DD HH:mm')} ${save ? '저장' : '불러오기'}`)
                    this.saveSlot2.setInteractive({
                        useHandCursor: true,
                    }).on('pointerdown', () => {
                        if (save) {
                            this.saveUserData(result[1]);
                        } else {
                            this.loadUserData(result[1])
                        }
                    })
                } else {
                    this.saveSlot2Text = this.add.text(390, 320, '저장 슬롯이 비어있습니다.')
                    if (save) {
                        this.saveSlot2.setInteractive({
                            useHandCursor: true,
                        }).on('pointerdown', () => {
                            this.saveUserData();
                        })
                    }

                }
            })
            .catch(e => {

                console.log(e)
                this.scene.stop('setting');
                if (e.status == 401) {
                    this.ngRedux.dispatch(showLoginModal(true))
                }
                if (this.fromStage) {
                    let target: DefenceStageScene = this.scene.get('stage') as any;
                    let { waveStep, deposit, map, towersMap, nextLimitTime, playerLifeByHeart } = target;
                    let _towersMap = {};
                    towersMap.forEach((turret, key) => {
                        _towersMap[key] = {
                            id: turret.id,
                            x: turret.x,
                            y: turret.y,
                            level: turret.getLevel(),
                            type: turret.type,
                        }
                    })
                    let _deposit = deposit.text;
                    window.localStorage.setItem('defence-try-save-not-loggin', '1');
                    window.localStorage.setItem('defence-temp-data', JSON.stringify({ waveStep, deposit: _deposit, map, towersMap: _towersMap, nextLimitTime, playerLifeByHeart }))
                    this.scene.run('stage')
                } else {
                    this.scene.run('index')
                }
            })
    }


    loadUserData(loadedData: { id, user_id, game_id, data, created_at, updated_at }) {



        let stage: DefenceStageScene = this.scene.get('stage') as any;
        window.localStorage.setItem('defence-temp-data', loadedData.data);
        stage.fromIndex = false;
        stage.resetStage();
        // if (!stage.isInit) {
        //     stage.preload()
        // }

        // let _data = JSON.parse(loadedData.data);
        // stage.towersMap.forEach(val => {
        //     val.setActive(false)
        //     val.setVisible(false)
        //     val.delLevelImage();
        //     val.destroy();
        //     val = null;
        // })
        // stage.towersMap = new Map();

        // stage.waveStep = _data.waveStep;
        // console.log(stage.deposit);
        // stage.deposit.setText(_data.deposit);
        // stage.map = _data.map;
        // stage.nextLimitTime = _data.nextLimitTime ? _data.nextLimitTime : 0;
        // let _towersMap = _data.towersMap


        // if (_towersMap) {
        //     Object.values(_towersMap).forEach((_turret: { id, x, y, type, level }) => {
        //         var turret: Turret
        //         switch (_turret.type) {
        //             case 'basic':
        //                 turret = stage.basicTurrets.get();
        //                 break;
        //             case 'quick':
        //                 turret = stage.quickTurrets.get();
        //                 break;
        //             case 'long_distance':
        //                 turret = stage.loginDistanceTurrets.get();
        //                 break;
        //             case 'slow_debuff':
        //                 turret = stage.slowDebuffTurrets.get();
        //                 break;
        //             default:
        //                 turret = stage.basicTurrets.get();
        //                 break;
        //         }
        //         if (turret) {
        //             let posIndex = _turret.id.split('-')
        //             turret.loadLevel(_turret.level)
        //             turret.setActive(true);
        //             turret.setVisible(true);
        //             turret.place(posIndex[0], posIndex[1]);
        //             turret.setLevelImage();
        //             turret.id = _turret.id
        //             turret.type = _turret.type;
        //             stage.towersMap.set(turret.id, turret);
        //         }

        //     });
        // }


        //
        alert('데이터를 불러왔습니다.')
        this.scene.stop('setting')
        this.scene.run('stage')

    }




    async saveUserData(overwriteData?) {


        let target: DefenceStageScene = this.scene.get('stage') as any;
        let { waveStep, deposit, map, towersMap, nextLimitTime, playerLifeByHeart } = target;
        let _towersMap = {};
        towersMap.forEach((turret, key) => {
            _towersMap[key] = {
                id: turret.id,
                x: turret.x,
                y: turret.y,
                level: turret.getLevel(),
                type: turret.type,
            }
        })
        let _deposit = deposit.text;

        if (overwriteData) {
            this.http
                .patch('game/defence/data', {
                    id: overwriteData.id,
                    game_id: 3,
                    data: JSON.stringify({
                        waveStep, deposit: _deposit, map, towersMap: _towersMap, nextLimitTime, playerLifeByHeart
                    }),
                    save_count: overwriteData.save_count
                })
                .toPromise()
                .then(r => {
                    alert('저장되었습니다.')
                    this.displaySaveSlot(true)
                })
                .catch(e => {
                    if (e.status == 401) {
                        window.localStorage.setItem('defence-try-save-not-loggin', '1');
                        window.localStorage.setItem('defence-temp-data', JSON.stringify({ waveStep, deposit: _deposit, map, towersMap: _towersMap, nextLimitTime, playerLifeByHeart }))
                        this.ngRedux.dispatch(showLoginModal(true))
                    }
                })
        } else {
            this.http
                .post('game/defence/data', { game_id: 3, data: JSON.stringify({ waveStep, deposit: _deposit, map, towersMap: _towersMap, nextLimitTime, playerLifeByHeart }) })
                .toPromise()
                .then(r => {
                    alert('저장되었습니다.')
                    this.displaySaveSlot(true)

                })
                .catch(e => {
                    if (e.status == 401) {
                        window.localStorage.setItem('defence-try-save-not-loggin', '1');
                        window.localStorage.setItem('defence-temp-data', JSON.stringify({ waveStep, deposit: _deposit, map, towersMap: _towersMap, nextLimitTime, playerLifeByHeart }))
                        this.ngRedux.dispatch(showLoginModal(true))
                    }
                })
        }
    }

}


