/**
 * @name content.js
 * @description このスクリプトは，https://sit-coop.jp/products/*にボタンを追加し，ボタンをクリックすると教科書情報をクリップボードにコピーするChrome拡張機能．一部余分な部分が抽出されるため，目視で修正すること．
 * 
 * @since 2024/07/01
 * @author 小島佑太
 * 
 * @version 1.0
 */



// ボタンを作成
//todo スマホでの表示に対応する
let button = document.createElement('button');
button.textContent = 'クリップボードに教科書情報をコピー';
button.style.position = 'absolute';
button.style.top = '100px';
button.style.right = '50px';
button.style.backgroundColor = 'blue';
button.style.color = 'white';
button.style.padding = '10px 20px';
button.style.zIndex = 1000;

button.addEventListener('click', () => {
    askToCopy();
});

// ドキュメントが読み込み終わったらボタンを表示する
document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(button);
});

/**
 * @function askToCopy
 * @description 教科書情報をクリップボードにコピーするかどうかを尋ねるウィンドウを表示する．yesボタンを押すと教科書情報をクリップボードにコピーする関数を呼び出す．
 * @param {void}
 * @return {void}
 * 
 * @since 2024/07/01
 * @author 小島佑太
 */
function askToCopy(){
    //ウィンドウを作成
    //todo スマホでの表示に対応する
    const window = document.createElement('div');
    window.id = 'askToCopyWindow';
    window.style.position = 'absolute';
    window.style.top = '0';
    window.style.left = '0';
    window.style.width = '100%';
    window.style.height = '100%';
    window.style.backgroundColor = 'rgba(255,255,255,1)';
    window.display = 'flex';
    window.style.alignItems = 'center';
    window.style.justifyContent = 'center';
    window.style.zIndex = 1001;
    document.body.appendChild(window);

    //規約文を表示
    const messageDiv = document.createElement('div');
    const message = document.createElement('pre');

    message.textContent = setMessage();
    messageDiv.appendChild(message);
    window.appendChild(messageDiv);


    //yesボタンを作成，クリック時に教科書情報をクリップボードにコピーする関数を呼び出し，ウィンドウを閉じる
    const yesButton = document.createElement('button');
    yesButton.textContent = '規約に同意して教科書情報をクリップボードにコピー';
    yesButton.addEventListener('click', () => {
        copyToClipboard();
        window.remove();
    });
    window.appendChild(yesButton);

    //noボタンを作成，クリック時にウィンドウを閉じる
    const noButton = document.createElement('button');
    noButton.textContent = 'キャンセル';
    noButton.addEventListener('click', () => {
        window.remove();
    });
    window.appendChild(noButton);
}

/**
 * @function copyToClipboard
 * @description 教科書情報を取得し，クリップボードにコピーする．
 * @param {void}
 * @return {void}
 * 
 * @since 2024/07/01
 * @author 小島佑太
 */
function copyToClipboard(){
    const textbooks = getTextbooks();
    //クリップボードにコピーする
    navigator.clipboard.writeText(textbooks);
    console.log('copied');
}

/**
 * @function getTextbooks
 * @description 教科書情報を取得する．
 * @param {void}
 * @return {string} 教科書情報
 * 
 * @since 2024/07/01
 * @author 小島佑太
 */
function getTextbooks(){
    let str = "";

    const cells = Array.from(document.getElementsByClassName('listlefttbloc'));
    cells.forEach((cell) => {
        let className = "";
        let teacherName = "";

        //cellのh3要素を取得
        const textbookName = cell.getElementsByTagName('h3')[0].textContent;
        //ul要素を取得する．
        const uls = Array.from(cell.getElementsByTagName('ul'));
        //ul要素の子要素liを取得
        uls.forEach((ul) => {
            const lis = Array.from(ul.getElementsByTagName('li'));
            lis.forEach((li) => {
                //li要素のうち，<span>【科目名】</span>, <span>【教員名】</span>のテキストを取得
                const spans = Array.from(li.getElementsByTagName('span'));
                spans.forEach((span) => {
                    if(span.textContent.includes("科目名")){
                        //console.log("科目名");
                        //console.log(li.textContent);
                        className = li.textContent;
                    }
                    else if(span.textContent.includes("教員名")){
                        //console.log("教員名");
                        //console.log(li.textContent);
                        teacherName = li.textContent;
                    }
                });
            });
        });
        str += normalizeTextbookName(textbookName) +", "+ normalizeClassName(className) + ", " + normalizeTeacherName(teacherName) + "\n";
    });
    console.log(str);
    return str;
}

/**
 * @function normalizeClassName
 * @description 授業名を正規化する．1. 【科目名】を削除，2. ,を削除，3. 全角英数字を半角英数字に変換する．
 * @param {string} str 授業名が含まれる文字列
 * @return {string} 授業名
 * 
 * @since 2024/07/01
 * @author 小島佑太
 */
function normalizeClassName(className){
    //【科目名】の部分を削除
    let ret = className.replace("【科目名】", "");
    //,を削除
    ret = ret.replace(",", "");
    //全角英数字を半角英数字に変換
    ret = ret.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });

    return ret;
}

/**
 * @function normalizeTextbookName
 * @description 教科書名を正規化する．1. 冒頭の空白を削除，2. ,を削除する．
 * 
 * @param {String} textbookName 
 * @returns {String} normalized textbook name
 * 
 * @since 2024/07/01
 * @author 小島佑太
 */
function normalizeTextbookName(textbookName) {
    //冒頭の空白を削除
    let ret = textbookName.trim();
    //,を削除
    ret = ret.replace(",", "");
    return ret;
}

/**
 * @function normalizeTeacherName
 * @description 教員名を正規化する．1. 【教員名】を削除，2. ,を削除，3. 全ての空白を削除，4. 全角空白を削除，5. 全角英数字を半角英数字に変換，6. 大文字を小文字に変換
 * 
 * @param {String} teacherName 
 * @returns {String} normalized teacher name
 * 
 * @since 2024/07/01
 * @author 小島佑太
 */
function normalizeTeacherName(teacherName) {
    //【教員名】の部分を削除
    let ret = teacherName.replace("【教員名】", "");
    //,を削除
    ret = ret.replace(",", "");
    //全ての空白を削除
    ret = ret.replace(/\s+/g, '');
    //全ての全角空白を削除
    ret = ret.replace(/　/g, '');
    //全角英数字を半角英数字に変換
    ret = ret.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    //全ての大文字を小文字に変換
    ret = ret.toLowerCase();
    return ret;
}

/**
 * @function setMessage
 * @description clip?というメッセージを返す．scomb-shibaura-ichibaからコピーした遺産．
 * @param {void}
 * @return {string} 規約文
 * 
 * @since 2024/07/01
 * @author 小島佑太 
 */
function setMessage(){
    const message = "clip?";

    return message;
}
