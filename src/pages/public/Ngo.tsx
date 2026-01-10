import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Phone, ExternalLink } from "lucide-react";

type NgoProps = {
    id: number;
    name: string;
    type: "International" | "Local" | "Government";
    focus: string[];
    contact: string;
    website: string;
    description: string;
};

const ngoData: NgoProps[] = [
    {
        id: 1,
        name: "Aga Khan Agency for Habitat (AKAH)",
        type: "International",
        focus: ["Disaster Relief", "Housing", "Water"],
        contact: "05811-455000",
        website: "https://www.akdn.org",
        description: "Focuses on building resilience to natural disasters and improving habitat in high-risk areas."
    },
    {
        id: 2,
        name: "Pakistan Red Crescent Society",
        type: "Local",
        focus: ["Emergency Response", "Health", "Blood Donation"],
        contact: "05811-920200",
        website: "https://www.prcs.org.pk",
        description: "The leading humanitarian organization in Pakistan, providing emergency medical services and relief."
    },
    {
        id: 3,
        name: "Al-Khidmat Foundation",
        type: "Local",
        focus: ["Orphan Care", "Disaster Management", "Clean Water"],
        contact: "05811-555111",
        website: "https://alkhidmat.org",
        description: "Dedicated to humanitarian services including disaster management and rehabilitation."
    },
    {
        id: 4,
        name: "GB Disaster Management Authority",
        type: "Government",
        focus: ["Policy", "Coordination", "Rescue 1122"],
        contact: "1122",
        website: "http://www.dmagb.gov.pk",
        description: "The provincial authority responsible for coordinating and implementing disaster management measures."
    },
    {
        id: 5,
        name: "WWF Pakistan",
        type: "International",
        focus: ["Environment", "Climate Change", "Conservation"],
        contact: "05811-450050",
        website: "https://www.wwfpak.org",
        description: "Works on climate change adaptation and environmental conservation in the region."
    }
];

export function Ngo() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container mx-auto max-w-6xl space-y-8 animate-in fade-in duration-700">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold text-slate-900">Partner Organizations</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Collaborating with international and local agencies to build a resilient Gilgit-Baltistan.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ngoData.map((ngo) => (
                        <Card key={ngo.id} className="hover:shadow-xl transition-all hover:-translate-y-1">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant={ngo.type === "Government" ? "secondary" : "default"}>
                                        {ngo.type}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl h-14 flex items-center">{ngo.name}</CardTitle>
                                <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                                    {ngo.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {ngo.focus.map((tag, i) => (
                                        <Badge key={i} variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 text-slate-700 font-medium">
                                    <Phone className="h-4 w-4 text-blue-600" /> {ngo.contact}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full group" asChild>
                                    <a href={ngo.website} target="_blank" rel="noopener noreferrer">
                                        <Globe className="mr-2 h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                                        Visit Website
                                        <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
