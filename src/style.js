import scssToCss from "@hai2007/algorithm/scss";

export default function () {

    let styleElement = document.createElement('style');
    let head = document.head || document.getElementsByTagName('head')[0];

    styleElement.innerHTML = scssToCss(`
        #calendar-dialog{
            .header {
                text-align: center;
                margin-bottom: 10px;
                &>button {
                    border: none;
                    background-color: transparent;
                    cursor: pointer;
                    height: 20px;
                    vertical-align: top;
                }
                &>h3 {
                    display: inline-block;
                    width: 150px;
                    cursor: pointer;
                }
            }
            .title>span,
            .items>span {
                display: inline-block;
                width: 35px;
                height: 35px;
                line-height: 35px;
                text-align: center;
            }
            .gray {
                color: #c2bbbb;
            }
            [tag]{
                cursor: pointer;
            }
            .items{
                &.dayview>span {
                    width: 35px;
                }

                &.monthview>span {
                    width: 60px;
                }

                &.yearview>span {
                    width: 80px;
                }
            }
        }
    `);
    styleElement.setAttribute('type', 'text/css');

    head.appendChild(styleElement);
};
