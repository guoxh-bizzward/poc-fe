import React from 'react';
import mirror, { connect } from 'mirrorx';

// 组件引入
import CurrtypeTable from './components/currtype-root/CurrtypeTable';
import CurrtypeSelectTable from './components/currtype-root/CurrtypeSelectTable';
import CurrtypePaginationTable from './components/currtype-root/CurrtypePaginationTable';
import CurrtypeEdit from './components/currtype-edit/Edit';
// 数据模型引入
import model from './model'
mirror.model(model);

// 数据和组件UI关联、绑定
export const ConnectedCurrtypeTable = connect( state => state.currtype, null )(CurrtypeTable);
export const ConnectedCurrtypeSelectTable = connect( state => state.currtype, null )(CurrtypeSelectTable);
export const ConnectedCurrtypePaginationTable = connect( state => state.currtype, null )(CurrtypePaginationTable);
export const ConnectedCurrtypeEdit = connect( state => state.currtype, null )(CurrtypeEdit);
