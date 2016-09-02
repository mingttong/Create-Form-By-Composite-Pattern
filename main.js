/**
 * Created by lenovo on 2016/9/2.
 */

// 准备工作

function inheritObject (o) {

    function F () {}
    F.prototype = o;
    return new F();

}

function inheritPrototype (subClass, superClass) {

    // 过渡类
    var p = inheritObject(superClass.prototype);
    p.constructor = subClass;
    subClass.prototype = p;

}

/*****
 * 用到的 DOM Core:
 * 1. document.createElement
 * 2. document.createTextNode
 * 3. element.appendChild
 */

console.log('####表单模块');

// ####祖先类

var Form = function () {

    // 子组件容器
    this.children = [];
    // 当前组件元素
    this.element = null;

};

Form.prototype = {

    init : function () {
        throw new Error('请重写你的方法');
    },
    getElement : function () {
        throw new Error('请重写你的方法');
    },
    add : function () {
        throw new Error('请重写你的方法');
    }

};

// ####<form>标签

var FormItem = function (id, parent) {

    if (!id || !parent) {
        throw new Error('请填写id和parent');
    }

    Form.call(this);
    this.id = id;
    this.parent = parent;
    this.init();

};

inheritPrototype(FormItem, Form);

FormItem.prototype.init = function () {

    this.element = document.createElement('form');
    this.element.id = this.id;
    this.element.className = 'new-formitem';

};

FormItem.prototype.getElement = function () {

    return this.element;

};

FormItem.prototype.add = function (child) {

    this.children.push(child);
    this.element.appendChild(child.getElement());

    return this;

};

FormItem.prototype.show = function () {

    this.parent.appendChild(this.element);

};

// ####<fieldset>标签

var FieldsetItem = function (classname, text) {

    Form.call(this);
    this.classname = classname || '';
    this.text = text || '';
    this.legend = null;
    this.init();

};

inheritPrototype(FieldsetItem, Form);

FieldsetItem.prototype.init = function () {

    this.element = document.createElement('fieldset');
    this.element.className = this.classname;
    this.legend = document.createElement('legend');
    this.legend.appendChild(document.createTextNode(this.text));
    this.element.appendChild(this.legend);

};

FieldsetItem.prototype.getElement = function () {

    return this.element;

};

FieldsetItem.prototype.add = function (child) {

    this.children.push(child);
    this.element.appendChild(child.getElement());

    return this;
};

// ####组

var Group = function (classname) {

    Form.call(this);
    this.classname = classname || '';
    this.init();

};

inheritPrototype(Group, Form);

Group.prototype.init = function () {

    this.element = document.createElement('div');
    this.element.className = this.classname;

};

Group.prototype.getElement = function () {

    return this.element;

};

Group.prototype.add = function (child) {

    this.children.push(child);
    this.element.appendChild(child.getElement());

    return this;

};

// ####<label>标签

var LabelItem = function (classname, text) {

    Form.call(this);
    this.classname = classname;
    this.text = text;
    this.init();

};

inheritPrototype(LabelItem, Form);

LabelItem.prototype.init = function () {

    this.element = document.createElement('label');
    this.element.className = this.classname;
    this.element.appendChild(document.createTextNode(this.text));

};

LabelItem.prototype.getElement = function () {

    return this.element;

};

LabelItem.prototype.add = function () {

    // 使用基类add发出警告
    throw new Error('基类元素不允许添加子元素');

};

// ####<input>标签

var InputItem = function (classname) {

    Form.call(this);
    this.classname = classname || '';
    this.init();

};

inheritPrototype(InputItem, Form);

InputItem.prototype.init = function () {

    this.element = document.createElement('input');
    this.element.className = this.classname;

};

InputItem.prototype.getElement = function () {

    return this.element;

};

InputItem.prototype.add = function () {

    throw new Error('基类元素不允许添加子元素');

};

// ####<span>标签

var SpanItem = function (text) {

    Form.call(this);
    this.text = text;
    this.init();

};

inheritPrototype(SpanItem, Form);

SpanItem.prototype.init = function () {

    this.element = document.createElement('span');
    this.element.className = this.classname;

};

SpanItem.prototype.getElement = function () {

    return this.element;

};

SpanItem.prototype.add = function () {

    throw new Error('基类元素不允许添加子元素');

};

// ##################实例##################

var form = new FormItem('FormItem', document.body);

form.add(
    new FieldsetItem('user_name', '账号').add(
        new Group().add(
            new LabelItem('user_name', '用户名：')
        ).add(
            new InputItem('username')
        ).add(
            new SpanItem('4到6位数字或字母')
        )
    ).add (
        new Group().add(
            new LabelItem('user_password', '密码：')
        ).add(
            new InputItem('user_password')
        ).add(
            new SpanItem('6到12位数字或者字母')
        )
    )
).add(
    new FieldsetItem('message', '信息').add(
        new Group().add(
            new LabelItem('nick_name', '昵称：')
        ).add(
            new InputItem('nick_name')
        )
    ).add(
        new Group().add(
            new LabelItem('status', '状态：')
        ).add(
            new InputItem('status')
        )
    )
).show();
