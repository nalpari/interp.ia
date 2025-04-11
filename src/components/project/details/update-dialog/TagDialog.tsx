import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Project } from "../../project-type";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useState } from "react";

export default function TagDialog({ project, updateProjectMutation }: { project: Project, updateProjectMutation: (request: {id: number, key: string, value: object | string}) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [tags, setTags] = useState<string[]>(project.tag || []);
    const [currentTag, setCurrentTag] = useState('');

    const handleOpen = () => {
        setTags(project.tag || []);
        setCurrentTag('');
        setIsOpen(true);
    }

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    }

    const handleSave = async () => {
        try {
            await updateProjectMutation({id: project.id, key: 'tag', value: tags});
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to update tags:", error);
        }
    }

  return (
    <>
        <Card className="cursor-pointer hover:bg-gray-50" onClick={handleOpen}>
          <CardHeader className="text-lg font-bold">Tags</CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-1">
                {project?.tag?.length > 0 ? (
                    project.tag.map((tag, index) => (
                        <Badge key={index} variant="outline">
                            {tag}
                        </Badge>
                    ))
                ) : (
                    <span className="text-sm text-muted-foreground">No tags</span>
                )}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
                <DialogTitle>태그 수정</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-6 items-start gap-4 pt-4">
                <Label htmlFor="tags-input" className="text-right pt-2">
                  Tags
                </Label>
                <div className="col-span-5 flex flex-wrap gap-1 border rounded-md px-3 py-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring min-h-[40px]">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="h-6 bg-muted hover:bg-muted-foreground/20">
                      {tag}
                      <button type="button" className="ml-1 hover:text-destructive" onClick={() => removeTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  <input
                    id="tags-input"
                    type="text"
                    className="flex-1 min-w-[100px] outline-none bg-transparent text-sm"
                    placeholder={tags.length === 0 ? '태그 입력 후 Enter' : ''}
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && currentTag.trim()) {
                        e.preventDefault();
                        const newTag = currentTag.trim();
                        if (!tags.includes(newTag)) {
                          setTags([...tags, newTag]);
                        }
                        setCurrentTag('');
                      } else if (e.key === 'Backspace' && !currentTag && tags.length > 0) {
                        e.preventDefault();
                        removeTag(tags[tags.length - 1]);
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave}>저장</Button>
              </DialogFooter>
          </DialogContent>
        </Dialog>
    </>
  )
}
