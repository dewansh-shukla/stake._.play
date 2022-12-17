const ContestCreator = () => {
  return (
    <>
      <input type='checkbox' id='createContest' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box relative'>
          <label
            htmlFor='createContest'
            className='btn btn-sm btn-circle absolute right-2 top-2'
          >
            ✕
          </label>
          <h3 className='text-lg font-bold'>Create Contest</h3>
          <p className='py-4'>Contest creator</p>
        </div>
      </div>
    </>
  )
}
export default ContestCreator
