import Image from 'next/image'
import { Badge } from './ui/badge'
import { Project } from './project/project-type'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { CalendarIcon } from 'lucide-react'

interface ExpandingCardProps {
  project: Project
}

export default function ExpandingCard({ project }: ExpandingCardProps) {
  return (
    // <div className="relative overflow-hidden h-[300px] rounded-lg shadow-md group">
    //   <div className="relative h-full">
    //     <Image src={image || '/placeholder.svg'} alt={title} layout="fill" objectFit="cover" />
    //   </div>
    //   <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 transition-all duration-300 ease-in-out h-[100px] group-hover:h-[70%] overflow-hidden">
    //     <div className="p-4">
    //       <div className="flex items-center gap-3">
    //         <h2 className="text-xl font-semibold mb-2">{title}</h2>
    //         <Badge className="mr-2">
    //           {type}
    //         </Badge>
    //         <Badge variant="outline" className="mr-2">
    //           {status}
    //         </Badge>
    //       </div>
    //       <div className="transition-all duration-300 ease-in-out max-h-[40px] group-hover:max-h-[calc(100%-40px)] overflow-hidden">
    //         <p>{description}</p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <Card key={project.id} className='overflow-hidden cursor-pointer hover:bg-gray-100'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-2xl font-semibold'>{project.title}</CardTitle>
        <CardDescription className='text-medium text-muted-foreground'>
          {project.subTitle} · Created by {project.creator.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>
          {project.description}
        </p>
        <div className='mt-4 flex items-center text-sm text-muted-foreground'>
          <CalendarIcon className='w-4 h-4 mr-2' />
          {project.startDate && project.endDate ? (
            <span>
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </span>
          ) : (
            <span>
              No date
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Badge>{project.type}</Badge>
        <Badge variant='outline' className='ml-3'>{project.status}</Badge>
      </CardFooter>
    </Card>
  )
}

// Helper function to format the date
const formatDate = (date: Date) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};
