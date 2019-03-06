import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";
import queryString from 'query-string';
import { Switch, InputNumber,Loading, Table, Button, Col, Row, Icon, InputGroup, FormControl, Checkbox, Modal, Panel, PanelGroup, Label, Message } from "tinper-bee";
import Radio from 'bee-radio';
import Header from "components/Header";
import options from "components/RefOption";
import DatePicker from 'bee-datepicker';
import Form from 'bee-form';
import Select from 'bee-select';
import RefWithInput from 'yyuap-ref/dist2/refWithInput'
import moment from "moment";
import 'yyuap-ref/dist2/yyuap-ref.css'//参照样式
import './edit.less';
import 'ac-upload/build/ac-upload.css';
import { setCookie, getCookie} from "utils";

const FormItem = Form.FormItem;
const Option = Select.Option;
const format = "YYYY-MM-DD HH:mm:ss";

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: {},
                refKeyArraypurOrg:[],
                refKeyArrayapplyNo:[],
            fileNameData: props.rowData.attachment || [],//上传附件数据
        }
    }
    async componentWillMount() {
        await actions.OrderInfo.getOrderTypes();
        let searchObj = queryString.parse(this.props.location.search);
        let { btnFlag } = searchObj;
        if (btnFlag && btnFlag > 0) {
            let { search_id } = searchObj;
            let tempRowData = await actions.OrderInfo.queryDetail({ search_id });
            let rowData = this.handleRefShow(tempRowData) || {};

            console.log('rowData',rowData);
            this.setState({
                rowData:rowData,
            })
        }

    }
    save = () => {//保存
        this.props.form.validateFields(async (err, values) => {
            values.attachment = this.state.fileNameData;
            let numArray = [
                "orderAmount",
            ];
            for(let i=0,len=numArray.length; i<len; i++ ) {
                values[numArray[i]] = Number(values[numArray[i]]);
            }


            if (err) {
                Message.create({ content: '数据填写错误', color: 'danger' });
            } else {
                let {rowData,
                    refKeyArraypurOrg,
                    refKeyArrayapplyNo,
                } = this.state;

                values.purOrg = refKeyArraypurOrg.join();
                values.applyNo = refKeyArrayapplyNo.join();
                values.releaseTime = values.releaseTime.format(format);
                values.confirmTime = values.confirmTime.format(format);
                let saveObj = Object.assign({}, rowData, values);

                await actions.OrderInfo.save(
                    saveObj,
                );
            }
        });
    }

    // 处理参照回显
    handleRefShow = (tempRowData) => {
        let rowData = {};
        if(tempRowData){

            let {
                purOrg,purOrgSrc,
                applyNo,applyName,
            } = tempRowData;

            this.setState({
                refKeyArraypurOrg: purOrg?purOrg.split(','):[],
                refKeyArrayapplyNo: applyNo?applyNo.split(','):[],
            })
            rowData = Object.assign({},tempRowData,
                {
                    purOrg:purOrgSrc,
                    applyNo:applyName,
                }
            )
        }
        return rowData;
    }

    onBack = async() => {
        window.history.go(-1);
    }

    // 动态显示标题
    onChangeHead = (btnFlag) => {
        let titleArr = ["新增","编辑","详情"];
        return titleArr[btnFlag]||'新增';
    }


    arryDeepClone = (array)=>{
        let result = [];
        if(array){
            array.map((item)=>{
                let temp = Object.assign([],item);
                result.push(temp);
            })
        }
    }

    // 通过search_id查询数据

    render() {
        const self = this;

        let { btnFlag,appType, id, processDefinitionId, processInstanceId } = queryString.parse(this.props.location.search);
        btnFlag = Number(btnFlag);
        let {rowData,
                    refKeyArraypurOrg,
                    refKeyArrayapplyNo,
        } = this.state;
        // 将boolean类型数据转化为string
        Object.keys(rowData).forEach(function(item){
            if(typeof rowData[item] === 'boolean'){
                rowData[item] = String(rowData[item]);
            }
        });


        let title = this.onChangeHead(btnFlag);
        let { orderType,orderNo,purOrg,releaseTime,orderAmount,applyNo,purGroupNo,purOrgSrc,confirmTime,applyName,orderState, } = rowData;
        const { getFieldProps, getFieldError } = this.props.form;

        return (
            <div className='OrderInfo-detail'>
                <Loading
                    showBackDrop={true}
                    loadingType="line"
                    show={this.props.showLoading}
                />
                <Header title={title} back={true} backFn={this.onBack}>
                    {(btnFlag < 2) ? (
                        <div className='head-btn'>
                            <Button className='head-cancel' onClick={this.onBack}>取消</Button>
                            <Button className='head-save' onClick={this.save}>保存</Button>
                        </div>
                    ) : ''}
                </Header>
                <Row className='detail-body'>

                            <Col md={4} xs={6}>
                                <Label>
                                    订单类型：
                                </Label>
                                    <Select disabled={btnFlag == 2}
                                        {
                                        ...getFieldProps('orderType', {
                                            initialValue: typeof orderType === 'undefined' ? "" : orderType ,
                                            rules: [{
                                                required: false, message: '请选择订单类型',
                                            }],
                                        }
                                        )}>
                                        <Option value="">请选择</Option>
                                            <Option value={ '0' }>生产订单</Option>
                                            <Option value={ '1' }>日常订单</Option>
                                            <Option value={ '2' }>临时订单</Option>
                                            <Option value={ '3' }>测试订单</Option>
                                    </Select>


                                <span className='error'>
                                    {getFieldError('orderType')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    编号：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('orderNo', {
                                            validateTrigger: 'onBlur',
                                            initialValue: orderNo || '',
                                            rules: [{
                                                type:'string',required: false,pattern:/\S+/ig, message: '请输入编号',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('orderNo')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    采购单位：
                                </Label>
                                     <RefWithInput disabled={btnFlag == 2} option={options({
                                                  title: '采购单位',
                                        refType: 1,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'neworganizition',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '1',
                                            locale:getCookie('u_locale'),
                                            //clientParam: '{"isUseDataPower":"true"}'
                                        },

                                        keyList:refKeyArraypurOrg,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArraypurOrg: temp,
                                            })
                                        },
                                        showKey:'name',
                                        verification:true,//是否进行校验
                                        verKey:'purOrg',//校验字段
                                        verVal:purOrg
                                    })} form={this.props.form}/> 

                                <span className='error'>
                                    {getFieldError('purOrg')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label class="datepicker">
                                    发布时间：
                                </Label>
                                <DatePicker className='form-item' disabled={btnFlag == 2}
                                    format={format}
                                    {
                                    ...getFieldProps('releaseTime', {
                                        initialValue: releaseTime? moment(releaseTime):moment(),
                                        validateTrigger: 'onBlur',
                                        rules: [{
                                            required: false, message: '请选择发布时间',
                                        }],
                                        onChange:function(value){
                                            self.setState({
                                                rowData:{
                                                    ...rowData,
                                                    releaseTime: value
                                                }
                                            })
                                        }
                                    }
                                    )}
                                />


                                <span className='error'>
                                    {getFieldError('releaseTime')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    订单金额：
                                </Label>


                                    <InputNumber
                                        precision={2}
                                        min={0}
                                        className={"input-number"}
                                        disabled={btnFlag == 2}
                                        {
                                            ...getFieldProps('orderAmount', {
                                                    initialValue: typeof orderAmount !== 'undefined' && Number(orderAmount).toFixed(2) || 0.00,
                                                    //rules: [{type: 'string',pattern: /^(?:(?!0\.00$))[\d\D]*$/ig,message: '请输入数字'}],
                                            })
                                        }
                                    />
                                <span className='error'>
                                    {getFieldError('orderAmount')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    供应商编号：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                                  title: '供应商编号',
                                        refType: 6,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'bd_common_currency',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '6',
                                            locale:getCookie('u_locale'),
                                            clientParam: '{"isUseDataPower":"true"}'
                                        },

                                        keyList:refKeyArrayapplyNo,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArrayapplyNo: temp,
                                            })
                                        },
                                        showKey:'name',
                                        verification:true,//是否进行校验
                                        verKey:'applyNo',//校验字段
                                        verVal:applyNo
                                    })} form={this.props.form}/>


                                <span className='error'>
                                    {getFieldError('applyNo')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    采购组编号：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('purGroupNo', {
                                            validateTrigger: 'onBlur',
                                            initialValue: purGroupNo || '',
                                            rules: [{
                                                type:'string',required: false,pattern:/\S+/ig, message: '请输入采购组编号',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('purGroupNo')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label class="datepicker">
                                    确认时间：
                                </Label>
                                <DatePicker className='form-item' disabled={btnFlag == 2}
                                    format={format}
                                    {
                                    ...getFieldProps('confirmTime', {
                                        initialValue: confirmTime? moment(confirmTime):moment(),
                                        validateTrigger: 'onBlur',
                                        rules: [{
                                            required: false, message: '请选择确认时间',
                                        }],
                                        onChange:function(value){
                                            self.setState({
                                                rowData:{
                                                    ...rowData,
                                                    confirmTime: value
                                                }
                                            })
                                        }
                                    }
                                    )}
                                />


                                <span className='error'>
                                    {getFieldError('confirmTime')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    订单状态：
                                </Label>
                                    <Select disabled={btnFlag == 2}
                                        {
                                        ...getFieldProps('orderState', {
                                            initialValue: typeof orderState === 'undefined' ? "" : orderState ,
                                            rules: [{
                                                required: false, message: '请选择订单状态',
                                            }],
                                        }
                                        )}>
                                        <Option value="">请选择</Option>
                                            <Option value={ '0' }>未提交</Option>
                                            <Option value={ '1' }>已提交</Option>
                                    </Select>


                                <span className='error'>
                                    {getFieldError('orderState')}
                                </span>
                            </Col>
                </Row>


            </div>
        )
    }
}

export default Form.createForm()(Edit);
