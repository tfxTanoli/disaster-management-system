import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function Privacy() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl animate-in fade-in duration-700">
            <ScrollArea className="h-[80vh] pr-4">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
                        <p className="text-slate-500">Last updated: January 1, 2026</p>
                    </div>

                    <Separator className="my-6" />

                    <div className="prose prose-slate max-w-none text-slate-700 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Introduction</h2>
                            <p>
                                The Gilgit-Baltistan Disaster Management Authority ("GB-DMA", "we", "us", or "our") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website or use our mobile application and tell you about your privacy rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Data We Collect</h2>
                            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                                <li><strong>Location Data:</strong> includes GPS coordinates when you use our "Report Incident" feature or opt-in for location-based alerts.</li>
                                <li><strong>Usage Data:</strong> includes information about how you use our website and services.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">3. How We Use Your Data</h2>
                            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>To coordinate disaster response and relief efforts.</li>
                                <li>To send you critical alerts relevant to your location.</li>
                                <li>To manage our relationship with you.</li>
                                <li>To improve our website, products/services, marketing or customer relationships.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Data Security</h2>
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Contact Us</h2>
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please contact us at: <br />
                                <strong>Email:</strong> privacy@gbdma.gov.pk <br />
                                <strong>Address:</strong> Civil Secretariat, Gilgit.
                            </p>
                        </section>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
