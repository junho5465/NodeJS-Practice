exports ={
    //잘못된 방법, exports에 객체를 지정하면, 새로운 변수로 처리
    getMember: function(){
        return{userId:'conan', userName:'코난'};
    },
    group:{userId:'group01', userName:'어린이탐정단'}
}