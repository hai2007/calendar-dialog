import scssToCss from "@hai2007/algorithm/scss";

export default function () {

    let styleElement = document.createElement('style');
    let head = document.head || document.getElementsByTagName('head')[0];

    styleElement.innerHTML = scssToCss(`
        #calendar-dialog{
            font-family: serif;
            .header {
                text-align: center;
                margin-bottom: 10px;
                white-space: nowrap;
                &>button {
                    border: none;
                    background-color: transparent;
                    cursor: pointer;
                    height: 20px;
                    vertical-align: top;
                    font-weight: 800;
                    font-size: 20px;
                    line-height: 20px;
                }
                &>h3 {
                    display: inline-block;
                    width: 180px;
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
                &:hover{
                    background-color: #f1ecec;
                    color: white;
                }
            }
            .items{
                &.dayview>span {
                    width: 35px;
                }

                &.monthview>span {
                    width: 60px;
                    line-height: 60px;
                    height: 60px;
                }

                &.yearview>span {
                    width: 80px;
                    line-height: 60px;
                    height: 60px;
                }
            }
        }
        #calendar-dialog_close{
            &:hover{
                color: #211e1e !important;
            }
        }
    `);
    styleElement.setAttribute('type', 'text/css');

    head.appendChild(styleElement);
};
