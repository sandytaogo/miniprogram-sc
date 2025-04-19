import env from '../../../../config/env'
const AuthStepType = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
};

Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    currAuthStep: {
      type: Number,
      value: AuthStepType.ONE,
    },
    userInfo: {
      type: Object,
      value: {},
    },
    isNeedGetUserInfo: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    defaultAvatarUrl: env.domain + '/images/miniapp/avatar/user-avatar2x.png',
    AuthStepType,
  },
  lifetimes: {
    attached() {
      //console.log('进入渲染..')
    }
  },
  methods: {
    gotoUserEditPage() {
      this.triggerEvent('gotoUserEditPage');
    },
  },
});
