import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves, Mountain, Activity } from "lucide-react";

export function Guidelines() {
    return (
        <div className="container mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Survival Guidelines</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Essential safety information and protocols for various disaster scenarios. Stay informed and prepared.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Flash Floods */}
                <Card className="border-t-4 border-t-blue-500 shadow-md">
                    <CardHeader>
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                                <Waves className="h-6 w-6" />
                            </div>
                            <CardTitle>Flash Floods</CardTitle>
                        </div>
                        <CardDescription>Sudden and destructive water flow.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Before a Flood</AccordionTrigger>
                                <AccordionContent className="text-slate-600">
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>Identify higher ground near your home.</li>
                                        <li>Prepare an emergency kit with food, water, and meds.</li>
                                        <li>Secure valuable items and documents in waterproof bags.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>During a Flood</AccordionTrigger>
                                <AccordionContent className="text-slate-600">
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>Move immediately to higher ground.</li>
                                        <li>Do not walk or drive through moving water.</li>
                                        <li>Listen to emergency broadcasts.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>After a Flood</AccordionTrigger>
                                <AccordionContent className="text-slate-600">
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>Avoid floodwaters (may be contaminated).</li>
                                        <li>Wait for "All Clear" before returning home.</li>
                                        <li>Clean and disinfect everything that got wet.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>

                {/* Earthquakes */}
                <Card className="border-t-4 border-t-orange-500 shadow-md">
                    <CardHeader>
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="p-2 bg-orange-100 rounded-full text-orange-600">
                                <Activity className="h-6 w-6" />
                            </div>
                            <CardTitle>Earthquakes</CardTitle>
                        </div>
                        <CardDescription>Sudden shaking of the ground.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Drop, Cover, Hold On</AccordionTrigger>
                                <AccordionContent className="text-slate-600">
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li><strong>DROP</strong> to your hands and knees.</li>
                                        <li><strong>COVER</strong> your head and neck under a sturdy table.</li>
                                        <li><strong>HOLD ON</strong> until the shaking stops.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Indoors Safety</AccordionTrigger>
                                <AccordionContent className="text-slate-600">
                                    Stay inside. Stay away from glass, windows, outside doors and walls. Do not use elevators.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>Outdoors Safety</AccordionTrigger>
                                <AccordionContent className="text-slate-600">
                                    Move away from buildings, streetlights, and utility wires. Once in the open, stay there until the shaking stops.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>

                {/* Landslides */}
                <Card className="border-t-4 border-t-yellow-600 shadow-md">
                    <CardHeader>
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="p-2 bg-yellow-100 rounded-full text-yellow-700">
                                <Mountain className="h-6 w-6" />
                            </div>
                            <CardTitle>Landslides</CardTitle>
                        </div>
                        <CardDescription>Movement of rock, earth, or debris.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Warning Signs</AccordionTrigger>
                                <AccordionContent className="text-slate-600">
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>New cracks or unusual bulges in the ground.</li>
                                        <li>Leaning telephone poles, trees, or fences.</li>
                                        <li>Sudden increase or decrease in creek water levels.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Immediate Action</AccordionTrigger>
                                <AccordionContent className="text-slate-600">
                                    If you suspect imminent danger, evacuate immediately. Inform neighbors and authorities if possible without delaying your escape.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
