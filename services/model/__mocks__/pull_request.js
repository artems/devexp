export default function () {
  return {
    set: sinon.stub().returnsThis(),
    save: sinon.stub().returnsThis()
  };
}
