import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { rewards } from '../type/rewards';
import { VoucherApi } from '@/features/Admin/ManagerVoucher/api/voucher_api';
import { RewardsApi } from '../api/rewards_api';

export const rewardsFields: FormField<rewards>[] = [
  {
    key: 'reward_id',
    label: 'ID',
    type: FormFieldType.Input,
    disabled: true,
  },
  {
    key: 'voucher_id',
    label: 'Voucher',
    type: FormFieldType.SelectFetch,
    placeholder: 'Chọn voucher',
    fetchOptions: async () => {
      try {
        const id = await RewardsApi.getRewards();
        const ids = id.data.data.rewards.map((r: any) => r.voucher_id)
        const res = await VoucherApi.getAll(1, 1000);
        const vouchers = res.data?.data?.vouchers || [];
        return vouchers.filter((v: any) => !ids.includes(v.voucher_id)).map((v: any) => ({
          label: `${v.code} - ${v.voucher_name} (Giảm ${v.discount_type === 'percent' ? v.value + '%' : v.value + 'đ'})`,
          value: v.voucher_id,
        }));
      } catch (error) {
        console.error("Lỗi khi tải danh sách voucher", error);
        return [];
      }
    },
    rules: [
      {
        required: true,
        message: 'Vui lòng chọn voucher.',
      }
    ]
  },
  {
    key: 'required_points',
    label: 'Điểm yêu cầu',
    type: FormFieldType.Input,
    placeholder: 'Nhập số điểm yêu cầu',
    rules: [
      {
        required: true,
        message: 'Vui lòng nhập điểm yêu cầu.',
      },
      {
        pattern: /^\d+$/,
        message: 'Điểm yêu cầu phải là một số nguyên dương.',
      }
    ]
  },
  {
    key: 'status',
    label: 'Trạng thái',
    type: FormFieldType.Select,
    options: [
      { value: 'active', label: 'Hoạt động' },
      { value: 'inactive', label: 'Không hoạt động' }
    ],
    rules: [
      {
        required: true,
        message: 'Vui lòng chọn trạng thái.',
      }
    ]
  },
  {
    key: 'voucher_code',
    label: 'Mã Voucher',
    type: FormFieldType.Input,
    disabled: true,
  },
  {
    key: 'voucher_name',
    label: 'Tên Voucher',
    type: FormFieldType.Input,
    disabled: true,
  },
  {
    key: 'discount_type',
    label: 'Loại giảm giá',
    type: FormFieldType.Input,
    disabled: true,
  },
  {
    key: 'discount_value',
    label: 'Giá trị giảm',
    type: FormFieldType.Input,
    disabled: true,
  },
  {
    key: 'created_at',
    label: 'Ngày tạo',
    type: FormFieldType.DatePicker,
    disabled: true,
  },
];