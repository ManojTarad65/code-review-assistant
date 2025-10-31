"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Sparkles,
  Bug,
  Zap,
  BookOpen,
  Target,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isLoading, setIsLoading] = useState(false);
  const [review, setReview] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setReview(null);

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to review code");
      }

      setReview(data.review);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score) => {
    if (score >= 8) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 6) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                <Code2 className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              CodeSense AI
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-white/90">
              Your AI-Powered Code Review Assistant
            </p>
            <p className="text-lg text-white/80 mb-8">
              Get instant feedback, detect bugs, and learn better coding
              practices
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                <Sparkles className="w-4 h-4 mr-1" /> AI-Powered
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                <Bug className="w-4 h-4 mr-1" /> Bug Detection
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                <Zap className="w-4 h-4 mr-1" /> Optimizations
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                <BookOpen className="w-4 h-4 mr-1" /> Learning
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Submit Your Code for Review
                </CardTitle>
                <CardDescription>
                  Paste your code below and select the programming language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Programming Language
                    </label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-full md:w-64">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Your Code
                    </label>
                    <Textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Paste your code here..."
                      className="min-h-[300px] font-mono text-sm"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    disabled={isLoading || !code.trim()}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing Code...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Review My Code
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6"
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Review Results */}
          <AnimatePresence>
            {review && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
                className="mt-8 space-y-6"
              >
                {/* Quality Score */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-6 h-6" />
                        Code Quality Score
                      </CardTitle>
                      <Badge
                        className={`text-2xl px-4 py-2 ${getScoreBadge(
                          review.qualityScore
                        )}`}
                      >
                        {review.qualityScore}/10
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>

                {/* Summary */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="w-5 h-5" />
                      Code Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{review.summary}</p>
                  </CardContent>
                </Card>

                {/* Detailed Review Tabs */}
                <Card className="shadow-lg border-0">
                  <CardContent className="pt-6">
                    <Tabs defaultValue="bugs" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                        <TabsTrigger
                          value="bugs"
                          className="text-xs md:text-sm"
                        >
                          <Bug className="w-4 h-4 mr-1" />
                          Bugs
                        </TabsTrigger>
                        <TabsTrigger
                          value="optimizations"
                          className="text-xs md:text-sm"
                        >
                          <Zap className="w-4 h-4 mr-1" />
                          Optimize
                        </TabsTrigger>
                        <TabsTrigger
                          value="readability"
                          className="text-xs md:text-sm"
                        >
                          <BookOpen className="w-4 h-4 mr-1" />
                          Readable
                        </TabsTrigger>
                        <TabsTrigger
                          value="refactored"
                          className="text-xs md:text-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Refactored
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="bugs" className="mt-6">
                        <div className="space-y-3">
                          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Bug className="w-5 h-5 text-red-600" />
                            Bugs & Issues
                          </h3>
                          {review.bugs && review.bugs.length > 0 ? (
                            <ul className="space-y-2">
                              {review.bugs.map((bug, index) => (
                                <motion.li
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                                >
                                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm">{bug}</span>
                                </motion.li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-muted-foreground">
                              No bugs detected! 🎉
                            </p>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="optimizations" className="mt-6">
                        <div className="space-y-3">
                          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-600" />
                            Optimization Suggestions
                          </h3>
                          {review.optimizations &&
                          review.optimizations.length > 0 ? (
                            <ul className="space-y-2">
                              {review.optimizations.map((opt, index) => (
                                <motion.li
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                                >
                                  <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm">{opt}</span>
                                </motion.li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-muted-foreground">
                              No optimizations needed!
                            </p>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="readability" className="mt-6">
                        <div className="space-y-3">
                          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            Readability Improvements
                          </h3>
                          {review.readability &&
                          review.readability.length > 0 ? (
                            <ul className="space-y-2">
                              {review.readability.map((item, index) => (
                                <motion.li
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                                >
                                  <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm">{item}</span>
                                </motion.li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-muted-foreground">
                              Code is already readable!
                            </p>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="refactored" className="mt-6">
                        <div className="space-y-3">
                          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            Refactored Code
                          </h3>
                          <div className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto">
                            <pre className="text-sm font-mono">
                              <code>{review.refactored}</code>
                            </pre>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Mentor Explanation */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      Mentor's Explanation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {review.explanation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            Powered by AI • Built with ❤️ using Next.js 14
          </p>
        </div>
      </div>
    </div>
  );
}
