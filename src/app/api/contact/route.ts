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
import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "Email service not configured" },
      { status: 503 }
    );
  }

  const { title, content, email } = await req.json();

  const resend = new Resend(apiKey);

  try {
    const data = await resend.emails.send({
      from: "문의 폼 <onboarding@resend.dev>",
      to: "unerue@me.com",
      subject: `[문의] ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1565c0;">새로운 문의가 도착했습니다</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>보낸 사람:</strong> ${email}</p>
            <p><strong>제목:</strong> ${title}</p>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3>문의 내용:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${content}</p>
          </div>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            이 이메일은 OpenData 웹사이트에서 자동으로 발송되었습니다.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("메일 전송 실패:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
