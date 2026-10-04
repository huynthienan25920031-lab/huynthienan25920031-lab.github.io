/**
 * Dải cực quang chính của hero: ruy băng dài chạy chéo từ trên trái xuống phải.
 * Ảnh dải đã blur sẵn (scripts/make-aurora.mjs), lặp liền mạch theo chiều ngang, nên
 * mọi chuyển động chỉ là transform và opacity:
 *  - ribbon-flow: trôi ngang liên tục, sóng chạy dọc theo dải
 *  - ribbon-sway: uốn (scaleY/skew) chậm
 *  - ribbon-pulse: sáng lên rồi dịu xuống, chu kỳ 10s
 *  - data-drift: AuroraBackdrop nghiêng/dịch theo con trỏ và trôi parallax khi cuộn
 *  - data-fade-scroll: lớp màu thứ hai hiện dần khi cuộn (đổi hue)
 */
export default function AuroraRibbon() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
      <div
        className="aurora-drift"
        style={{ left: '-25%', top: '14%', width: '150%', height: '50%', transform: 'rotate(13deg)' }}
        data-drift=""
        data-rotate="13"
        data-speed="0"
        data-depth="1"
        data-scroll="-0.22"
      >
        <div className="ribbon-pulse h-full w-full">
          <div className="ribbon-sway relative h-full w-full">
            <div className="ribbon-track" style={{ backgroundImage: 'url(/images/aurora-ribbon.webp)' }} />
            <div data-fade-scroll="" className="absolute inset-0" style={{ opacity: 0 }}>
              <div className="ribbon-track" style={{ backgroundImage: 'url(/images/aurora-ribbon-b.webp)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
