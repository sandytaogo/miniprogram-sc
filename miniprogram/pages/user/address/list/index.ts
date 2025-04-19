/* eslint-disable no-param-reassign */
import Toast from 'tdesign-miniprogram/toast/index';
import { resolveAddress, rejectAddress } from './util';
import { getAddressPromise } from '../edit/util';
import { fetchDeliveryAddressList, deleteAddress} from '../../../../services/address/fetchAddress';
Page({
  data: {
    id: '',
    addressList: [],
    deleteId: '',
    showDeleteConfirm: false,
    isOrderSure: false,
  },
  /** 选择模式 */
  selectMode: false,
  /** 是否已经选择地址，不置为true的话页面离开时会触发取消选择行为 */
  hasSelect: false,
  onLoad(query:any) {
    const { selectMode = '', isOrderSure = '', id = '' } = query;
    this.setData({isOrderSure: !!isOrderSure,id});
    this.selectMode = !!selectMode;
    this.getAddressList();
  },
  onUnload() {
    if (this.selectMode && !this.hasSelect) {
      rejectAddress(null);
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
   
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },
  /***
   * 刷新界面事件.
   */
  onRefresh() {
    this.getAddressList();
  },
  getAddressList() {
    const { id } = this.data;
    fetchDeliveryAddressList().then((addressList:any) => {
      addressList.forEach((address:any) => {
        if (address.id === id) {
          address.checked = true;
        }
      });
      this.setData({ addressList:  addressList});
    });
  },
  getWXAddressHandle() {
    wx.chooseAddress({
      success: (res: any) => {
        if (res.errMsg.indexOf('ok') === -1) {
          Toast({context: this,selector: '#t-toast',message: res.errMsg, icon: '',duration: 1000});
          return;
        }
        Toast({ context: this, selector: '#t-toast', message:'添加成功', icon: '', duration: 1000});
        const { length: len } = this.data.addressList;
        this.setData({[`addressList[${len}]`]: {
            name: res.userName,
            phoneNumber: res.telNumber,
            address: `${res.provinceName}${res.cityName}${res.countryName}${res.detailInfo}`,
            isDefault: 0,
            tag: '微信地址',
            id: len,
          }
        });
      }
    });
  },
  /**
   * 确认删除地址处理.
   * @param detail 
   */
  confirmDeleteHandle(detail:any) {
    const { id } = detail || {};
    if (id !== undefined) {
      this.setData({ deleteId: id, showDeleteConfirm: true });
      Toast({context: this,selector: '#t-toast', message: '地址删除成功', theme: 'success', duration: 1000});
    } else {
      Toast({ context: this,selector: '#t-toast',message: '需要组件库发新版才能拿到地址ID',icon: '',duration: 1000});
    }
  },
  /**
   * 创建地址处理.
   */
  createHandle() {
    this.waitForNewAddress();
    wx.navigateTo({ url: '/pages/user/address/edit/index' });
  },
  /***
   * 选择模式的处理.
   */
  selectHandle(event:any ) {
    if (this.selectMode) {
      this.hasSelect = true;
      resolveAddress(event.detail);
      wx.navigateBack({ delta: 1 });
    } else {
      this.editAddressHandle(event);
    }
  },
  /**
   * 编辑监听事件.
   * @param e evnet 
   */
  editAddressHandle(event: any) {
    this.waitForNewAddress();
    const { id } = event.detail || {};
    wx.navigateTo({ url: `/pages/user/address/edit/index?id=${id}`});
  },
  
  /**
   * 删除收货地址事件处理.
   * @param event 
   */
  deleteAddressHandle(event: any) {
    const { id } = event.currentTarget.dataset;
    deleteAddress({id:id}).then((res:any) => {
      if (res.code == 200) {
        this.setData({addressList: this.data.addressList.filter((address: any) => address.id !== id),deleteId: '',showDeleteConfirm: false});
      }
    })
  },
  /**
   * 等待新地址回调完成.
   */
  waitForNewAddress() {
    getAddressPromise().then((newAddress:any) => {
        let addressList = [...this.data.addressList] as any;
        newAddress.phoneNumber = newAddress.phone;
        newAddress.address = `${newAddress.provinceName}${newAddress.cityName}${newAddress.districtName}${newAddress.detailAddress}`;
        newAddress.tag = newAddress.addressTag;
        if (newAddress.modelState == 4) {
          newAddress.addressId = `${addressList.length}`;
          if (newAddress.isDefault === 1) {
            addressList = addressList.map((address:any) => {
              address.isDefault = 0;
              return address;
            });
          } else {
            newAddress.isDefault = 0;
          }
          addressList.push(newAddress);
        } else {
          addressList = addressList.map((address: any) => {
            if (newAddress.isDefault) {
              address.isDefault = 0;
            }
            if (address.id === newAddress.id) {
              return newAddress;
            }
            return address;
          });
        }
        addressList.sort((prevAddress: any, nextAddress: any) => {
          if (prevAddress.isDefault && !nextAddress.isDefault) {
            return -1;
          }
          if (!prevAddress.isDefault && nextAddress.isDefault) {
            return 1;
          }
          return 0;
        });
        this.setData({addressList: addressList,});
      })
      .catch((e) => {
        if (e.message !== 'cancel') {
          Toast({context: this, selector: '#t-toast',message: '地址编辑发生错误',icon: '',duration: 1000});
        }
      });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.onRefresh();
    wx.stopPullDownRefresh();
  },

  /**
   * 返回页面.
   */
  onBack() {
    wx.navigateBack({ delta: 1 });
  }
});
