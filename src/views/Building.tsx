// import meditiva from '@/assets/images/meditiva/meditiva.jpeg'
import { Spinner } from '@/components/ui/spinner'
export const Building = () => {
  return (
    <div className='min-h-[800px] h-screen flex flex-col justify-center items-center gap-5'>
      {/* <img src={meditiva} alt='logo' className='w-3/12' /> */}
      <Spinner />
    </div>
  )
}
