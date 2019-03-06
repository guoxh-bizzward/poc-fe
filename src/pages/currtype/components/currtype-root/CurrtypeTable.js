import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";

import Header from 'components/Header';
import CurrtypeTable from '../currtype-table';
import CurrtypeForm from '../currtype-form';

import './index.less';

/**
 * CurrtypeRoot Component
 */
class CurrtypeRoot  extends Component {
    constructor(props) {
        super(props);
        this.state = { }
    }
    /**
     *
     */
    componentWillMount() {
        this.getTableData();
    }
    /**
     * 获取table表格数据
     */
    getTableData = () => {
        actions.currtype.loadList();
    }

    render() {
        let { pageSize, pageIndex, totalPages} = this.props;
        return (
            <div className='currtype-root'>
                <Header title='币种' back={true}/>
                <CurrtypeForm { ...this.props }/>
                <CurrtypeTable { ...this.props }/>
            </div>
        )
    }
}
export default CurrtypeRoot;