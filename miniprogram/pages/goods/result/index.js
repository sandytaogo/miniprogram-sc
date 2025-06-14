/* eslint-disable no-param-reassign */
import { getSearchResult } from '../../../services/good/fetchSearchResult';
import Toast from 'tdesign-miniprogram/toast/index';

const initFilters = {overall: 1, sorts: ''};

Page({
  data: {
    regionId:null,
    goodsList: [],
    sorts: '',
    overall: 1,
    show: false,
    minVal: '',
    maxVal: '',
    minSalePriceFocus: false,
    maxSalePriceFocus: false,
    filter: initFilters,
    hasLoaded: false,
    keywords: '',
    loadMoreStatus: 0,
    loading: true,
  },

  total: 0,
  page: 1,
  pageSize: 30,

  onLoad(options) {
    const { searchValue = '' } = options || {};
    let app = getApp();
    this.setData({keywords: searchValue, regionId:app.globalData.regionId}, () => {
        this.init(true);
    });
  },

  generalQueryData(reset = false) {
    const { filter, keywords, minVal, maxVal } = this.data;
    const { page, pageSize } = this;
    const { sorts, overall } = filter;
    // 0 综合，1 价格
    const params = { sort: 0,  page: 1, pageSize: 30, regionId:this.data.regionId, keyword: keywords};
    if (sorts) {
      params.sort = 1;
      params.sortType = sorts === 'desc' ? 1 : 0;
    }
    if (overall) {
      params.sort = 0;
    } else {
      params.sort = 1;
    }
    params.minPrice = minVal ? minVal * 100 : 0;
    params.maxPrice = maxVal ? maxVal * 100 : undefined;
    if (reset) return params;
    return { ...params,page: page + 1,pageSize };
  },

  async init(reset = true) {
    const { loadMoreStatus, goodsList = [] } = this.data;
    const params = this.generalQueryData(reset);
    if (loadMoreStatus !== 0) 
      return;
    this.setData({loadMoreStatus: 1,loading: true});
    try {
      const result = await getSearchResult(params);
      if (result) {
        const { data, total = 0 } = result;
        if (total === 0 && reset) {
          this.total = total;
          this.setData({ emptyInfo: { tip: '抱歉，未找到相关商品', },hasLoaded: true,loadMoreStatus: 0, loading: false, goodsList: []});
          return;
        }
        const _goodsList = goodsList.concat(data);
        // _goodsList.forEach((v) => {
        //   v.tags = v.spuTagList.map((u) => u.title);
        //   v.hideKey = { desc: true };
        // });
        const _loadMoreStatus = _goodsList.length === total ? 2 : 0;
        this.page = params.page || 1;
        this.total = total;
        this.setData({goodsList: _goodsList,loadMoreStatus: _loadMoreStatus});
      } else {
        this.setData({loading: false });
        wx.showToast({title: '查询失败，请稍候重试' });
      }
    } catch (error) {
      this.setData({loading: false});
    }
    this.setData({hasLoaded: true, loading: false });
  },

  handleCartTap() {
    wx.switchTab({ url: '/pages/cart/index'});
  },
  /**
   * 更新搜索框内容.
   * @param {*} event 
   */
  onChangeSearchValue(event) {
    const { value } = event.detail;
    this.data.keywords = value;
  },

  handleSubmit() {
    this.setData({goodsList: [], loadMoreStatus: 0 }, () => {
        this.init(true);
    });
  },

  onReachBottom() {
    const { goodsList } = this.data;
    const { total = 0 } = this;
    if (goodsList.length === total) {
      this.setData({
        loadMoreStatus: 2,
      });
      return;
    }
    this.init(false);
  },

  handleAddCart() {
    Toast({context: this, selector: '#t-toast', message: '点击加购'});
  },

  gotoGoodsDetail(e) {
    const { index } = e.detail;
    const { spuId, storeId } = this.data.goodsList[index];
    if (spuId) {
      wx.navigateTo({url: `/pages/goods/details/index?spuId=${spuId}`});
    } else {
      wx.navigateTo({url: `/pages/shop/shop?id=${storeId}`});
    }
  },

  handleFilterChange(e) {
    const { overall, sorts } = e.detail;
    const { total } = this;
    const _filter = {sorts, overall};
    this.setData({filter: _filter,sorts,overall});
    this.page = 1;
    this.setData({ goodsList: [],loadMoreStatus: 0}, () => {
        total && this.init(true);
    });
  },

  showFilterPopup() {
    this.setData({show: true});
  },

  showFilterPopupClose() {
    this.setData({show: false });
  },

  onMinValAction(e) {
    const { value } = e.detail;
    this.setData({ minVal: value });
  },

  onMaxValAction(e) {
    const { value } = e.detail;
    this.setData({ maxVal: value });
  },

  reset() {
    this.setData({ minVal: '', maxVal: '' });
  },

  confirm() {
    const { minVal, maxVal } = this.data;
    let message = '';
    if (minVal && !maxVal) {
      message = `价格最小是${minVal}`;
    } else if (!minVal && maxVal) {
      message = `价格范围是0-${minVal}`;
    } else if (minVal && maxVal && minVal <= maxVal) {
      message = `价格范围${minVal}-${this.data.maxVal}`;
    } else {
      message = '请输入正确范围';
    }
    if (message) {
      Toast({context: this,selector: '#t-toast', message});
    }
    this.page = 1;
    this.setData({ show: false, minVal: '',goodsList: [], loadMoreStatus: 0,maxVal: ''}, () => {
        this.init();
    });
  }
});
