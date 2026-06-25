

const PurchaseHistory = () => {
  return (
    <section className='space-y-5'>
      <div>
        <p className='text-sm font-semibold uppercase tracking-[0.22em] text-[#b95b2d]'>Lịch sử mua hàng</p>
        <h2 className='mt-2 text-3xl font-semibold text-[#1f1935]'>Danh sách đơn đã hoàn tất</h2>
      </div>
      <div className='rounded-2xl border border-amber-100 bg-[#fffaf4] p-5'>
        <p className='text-sm leading-6 text-[#675f80]'>Tại đây có thể liệt kê các giao dịch cũ, tổng tiền, phương thức thanh toán và số lượng sản phẩm đã mua.</p>
      </div>
    </section>
  )
}

export default PurchaseHistory
