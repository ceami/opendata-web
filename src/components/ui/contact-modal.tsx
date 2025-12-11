/*
 * Copyright 2025 Team Aeris
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Label } from "./label";
import toast from "react-hot-toast";
interface ContactModalProps {
  trigger: React.ReactNode;
}

export function ContactModal({ trigger }: ContactModalProps) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !email.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/sever/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTitle("");
        setContent("");
        setEmail("");
        setOpen(false);
        toast.success("문의가 성공적으로 전송되었습니다!");
      } else {
        toast.error("문의 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast.error(
        "네트워크 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl">문의하기</DialogTitle>
          <DialogDescription>
            궁금한 점이나 요청 사항을 작성해 주세요. 이메일로 답변드리겠습니다.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-title">제목</Label>
            <Input
              id="contact-title"
              placeholder="문의 제목을 입력해 주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-content">내용</Label>
            <Textarea
              id="contact-content"
              placeholder="문의 내용을 상세히 작성해 주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] resize-none"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">이메일</Label>
            <Input
              id="contact-email"
              placeholder="이메일을 입력해 주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="bg-[#1565c0] text-white hover:bg-[#1565c0]/90"
            >
              {isSubmitting ? "전송 중..." : "문의 보내기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
