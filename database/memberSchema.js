var Schema = {};

Schema.createSchema = function (mongoose) {
    //스키마 정의
    MemberSchema = mongoose.Schema({
        userId: { type: String, required: true, unique: true },
        userPwd: { type: String, required: true },
        userName: { type: String, index: 'hashed' },
        age: { type: Number, 'default': -1 },
        regDate: { type: Date, index: { unique: false }, 'default': Date.now },
        updateDate: { type: Date, index: { unique: false }, 'default': Date.now },
    })
    //스키마에 static 메소드 추가
    MemberSchema.static('findById', function (userId, callback) {
        return this.find({ userId: userId }, callback);
    });
    MemberSchema.static('findAll', function (callback) {
        return this.find({}, callback);
    });
    console.log('MemberSchema 정의함.');
    return MemberSchema;
};

module.exports = Schema;