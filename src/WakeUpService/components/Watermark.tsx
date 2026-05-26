/** AlterU watermark in the LCD corner. Memory rule: NOT Aigram. */
export default function Watermark() {
  return (
    <div className="wus-watermark" aria-hidden>
      <img src="img/alteru.svg" alt="" draggable={false} />
    </div>
  );
}
